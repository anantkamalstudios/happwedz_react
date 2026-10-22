// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Profile tab — built by helper E. One card per section of the Google profile with what Google shows now; edit one
// section at a time (description with AI help, hours, special hours, contact, services, categories, attributes,
// address, service area, open status, name, more hours) and save it on Google. Risky sections ask for a tick first.
// Google's suggested changes can be accepted or rejected above the cards.
// API: gpManageApi.profile (GrowthOS profileEditSchema) and the forms in ProfileSections.jsx.
import { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import { WEEKDAYS } from "../gpFormat";
import {
  AddressForm,
  AttributesForm,
  CategoriesForm,
  ContactForm,
  DescriptionForm,
  HoursForm,
  MoreHoursForm,
  NameForm,
  OpenStatusForm,
  ServiceAreaForm,
  ServicesForm,
  SpecialHoursForm,
} from "./ProfileSections";
import { TabError, TabLoading } from "./ProfileShared";
import ProfileUpdates from "./ProfileUpdates";
import { formatDay } from "./ProfileUtils";

// GrowthOS's order and section names (PROFILE_SECTIONS), with plain titles.
const SECTIONS = [
  { id: "name", title: "Business name", Form: NameForm },
  { id: "categories", title: "Categories", Form: CategoriesForm },
  { id: "description", title: "Description", Form: DescriptionForm },
  { id: "contact", title: "Phone and website", Form: ContactForm },
  { id: "address", title: "Address", Form: AddressForm },
  { id: "service_area", title: "Service area", Form: ServiceAreaForm },
  { id: "hours", title: "Opening hours", Form: HoursForm },
  { id: "special_hours", title: "Special hours", Form: SpecialHoursForm },
  { id: "more_hours", title: "More hours", Form: MoreHoursForm },
  { id: "open_status", title: "Open status", Form: OpenStatusForm },
  { id: "services", title: "Services", Form: ServicesForm },
  { id: "attributes", title: "Attributes", Form: AttributesForm },
];

const RISKY = ["name", "categories", "address", "service_area"];

const OPEN_STATUS = { OPEN: "Open", CLOSED_TEMPORARILY: "Temporarily closed", CLOSED_PERMANENTLY: "Permanently closed" };
const BUSINESS_TYPE = {
  CUSTOMER_AND_BUSINESS_LOCATION: "At your business and at customers' places",
  CUSTOMER_LOCATION_ONLY: "Only at customers' places",
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const range = (r) => `${r.open}–${r.close === "24:00" ? "midnight" : r.close}`;

/** What one section shows on Google now (text, or a small list for hours). Null = not set. */
function Summary({ section, data }) {
  const p = data.profile;
  const text = (value) => (value ? <p className="gp-e-summary">{value}</p> : <p className="gp-e-summary gp-muted">Not set</p>);
  switch (section) {
    case "name":
      return text(p.title);
    case "categories":
      return text(
        [p.primary_category?.display_name ? `${p.primary_category.display_name} (main)` : null, ...p.additional_categories.map((c) => c.display_name)]
          .filter(Boolean)
          .join(", "),
      );
    case "description":
      return text(p.description);
    case "contact":
      return text([p.primary_phone, ...(p.additional_phones || []), p.website].filter(Boolean).join(" · "));
    case "address":
      return text(p.address ? [...(p.address.address_lines || []), p.address.locality, p.address.administrative_area, p.address.postal_code].filter(Boolean).join(", ") : "");
    case "service_area":
      return text(
        p.service_area
          ? [BUSINESS_TYPE[p.service_area.business_type], p.service_area.places.length ? p.service_area.places.map((x) => x.name).join(", ") : "No areas"]
              .filter(Boolean)
              .join(" · ")
          : "",
      );
    case "hours": {
      if (!p.regular_hours.length) return text("");
      return (
        <dl className="gp-e-hours">
          {WEEKDAYS.map((day) => {
            const ranges = p.regular_hours.filter((h) => h.day === day.id);
            return (
              <div key={day.id}>
                <dt>{day.short}</dt>
                <dd>{ranges.length ? ranges.map(range).join(", ") : "Closed"}</dd>
              </div>
            );
          })}
        </dl>
      );
    }
    case "special_hours":
      if (!p.special_hours.length) return text("No special dates");
      return text(
        `${plural(p.special_hours.length, "special date", "special dates")}: ${p.special_hours
          .slice(0, 4)
          .map((d) => `${formatDay(d.date)} ${d.closed ? "closed" : `${d.open}–${d.close}`}`)
          .join(", ")}${p.special_hours.length > 4 ? ", …" : ""}`,
      );
    case "more_hours":
      if (!data.more_hours_types.length) return text("Google offers no extra hours for your category.");
      return text(
        p.more_hours.length
          ? p.more_hours.map((h) => data.more_hours_types.find((t) => t.id === h.type_id)?.name || h.type_id).join(", ")
          : "None set",
      );
    case "open_status":
      return text(
        [OPEN_STATUS[p.open_status?.status] || p.open_status?.status, p.open_status?.opening_date ? `Opening date ${formatDay(p.open_status.opening_date)}` : null]
          .filter(Boolean)
          .join(" · "),
      );
    case "services":
      return text(
        p.services_on_google.length
          ? `${plural(p.services_on_google.length, "service", "services")} on Google: ${p.services_on_google.map((s) => s.label).join(", ")}`
          : "No services on Google",
      );
    case "attributes":
      if (!data.attributes.meta.length) return text("Google offers no attributes for your category.");
      return text(data.attributes.values.length ? `${data.attributes.values.length} set` : "None set");
    default:
      return null;
  }
}

/** Sections Google offers nothing to edit in for this category (or did not send this time). */
const noEditor = (section, data) =>
  (section === "more_hours" && (!data.more_hours_types.length || data.unavailable.includes("more_hours"))) ||
  (section === "attributes" && (!data.attributes.meta.length || data.unavailable.includes("attributes")));

/** The answer in the shape the forms expect (missing lists → empty). */
const normalise = (raw) => {
  const p = raw?.profile || {};
  return {
    ...raw,
    profile: {
      ...p,
      title: p.title || "",
      description: p.description || "",
      additional_categories: p.additional_categories || [],
      additional_phones: p.additional_phones || [],
      regular_hours: p.regular_hours || [],
      special_hours: p.special_hours || [],
      more_hours: p.more_hours || [],
      services_on_google: p.services_on_google || [],
      open_status: p.open_status || { status: "OPEN", opening_date: null },
    },
    more_hours_types: raw?.more_hours_types || [],
    attributes: { meta: raw?.attributes?.meta || [], values: raw?.attributes?.values || [] },
    growthos_services: raw?.growthos_services || [],
    currency: raw?.currency || "INR",
    unavailable: Array.isArray(raw?.unavailable) ? raw.unavailable : [],
  };
};

export default function ProfileTab() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [open, setOpen] = useState(null);
  const [done, setDone] = useState("");
  const editButtons = useRef({});

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const raw = await gpManageApi.profile();
      setState({ status: "ready", data: normalise(raw), error: null });
    } catch (error) {
      setState((s) => (quiet && s.status === "ready" ? s : { ...s, status: "error", error }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const close = (section) => {
    setOpen(null);
    window.requestAnimationFrame(() => editButtons.current[section]?.focus());
  };

  const onSaved = (section) => {
    const title = SECTIONS.find((s) => s.id === section)?.title || "The section";
    setDone(
      `${title} saved on Google.${RISKY.includes(section) ? " Google may review it before showing it." : " Google may take a few minutes to show it."}`,
    );
    close(section);
    load(true);
  };

  if (state.status === "loading") return <TabLoading label="Loading your Google profile…" />;
  if (state.status === "error") return <TabError error={state.error} onRetry={() => load()} />;

  const data = state.data;
  const missing = data.unavailable.filter((part) => part === "more_hours" || part === "attributes");

  return (
    <div className="gp-e-tab">
      <div className="gp-e-stack-sm">
        <h2 className="gp-h3">Your Google profile</h2>
        <p className="gp-note">
          Changes are saved on Google at once and read back from Google. Google may take a few minutes to show them.
        </p>
      </div>

      <ProfileUpdates onChanged={() => load(true)} />

      <div aria-live="polite">{done && <Callout tone="ok">{done}</Callout>}</div>

      {missing.length > 0 && (
        <Callout tone="warn">
          Google did not send {missing.map((m) => (m === "attributes" ? "attributes" : "more hours")).join(" and ")} this time.
          Everything else can be edited; try again later for these.
        </Callout>
      )}

      <div className="gp-e-sections">
        {SECTIONS.map((section) => {
          const { id, title } = section;
          const Form = section.Form;
          const editing = open === id;
          return (
            <section key={id} className={`gp-e-sec${editing ? " is-editing" : ""}`} aria-labelledby={`gp-e-sec-${id}`}>
              <div className="gp-e-sec-head">
                <h3 className="gp-e-sec-title" id={`gp-e-sec-${id}`}>
                  {title}
                  {RISKY.includes(id) && <span className="visually-hidden"> (Google may review changes)</span>}
                </h3>
                {!editing && !noEditor(id, data) && (
                  <button
                    type="button"
                    ref={(el) => {
                      editButtons.current[id] = el;
                    }}
                    className="gp-btn gp-btn-ghost gp-e-btn-sm"
                    disabled={open !== null}
                    onClick={() => {
                      setDone("");
                      setOpen(id);
                    }}
                  >
                    <FiEdit2 size={16} aria-hidden="true" />
                    Edit<span className="visually-hidden"> {title.toLowerCase()}</span>
                  </button>
                )}
              </div>
              {editing ? (
                <Form data={data} title={title} onSaved={onSaved} onCancel={() => close(id)} />
              ) : (
                <Summary section={id} data={data} />
              )}
            </section>
          );
        })}
      </div>
      {open !== null && <p className="gp-note">Finish or cancel the section you're editing to edit another.</p>}
    </div>
  );
}
