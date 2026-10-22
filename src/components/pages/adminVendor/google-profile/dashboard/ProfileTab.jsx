// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Profile tab — built by helper E. One card per section of the Google profile with what Google shows now; edit one
// section at a time (description with AI help, hours, special hours, contact, services, categories, attributes,
// address, service area, open status, name, more hours) and save it on Google. Risky sections ask for a tick first.
// Google's suggested changes can be accepted or rejected above the cards.
// API: gpManageApi.profile (GrowthOS profileEditSchema) and the forms in ProfileSections.jsx.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiAlignLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiGlobe,
  FiList,
  FiMap,
  FiMapPin,
  FiPhone,
  FiSliders,
  FiTag,
  FiWatch,
} from "react-icons/fi";
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

// GrowthOS's section names (PROFILE_SECTIONS), with plain titles. `wide` cards take the full row.
const SECTIONS = [
  { id: "name", title: "Business name", Form: NameForm, Icon: FiBriefcase },
  { id: "categories", title: "Categories", Form: CategoriesForm, Icon: FiTag },
  { id: "description", title: "Description", Form: DescriptionForm, Icon: FiAlignLeft, wide: true },
  { id: "contact", title: "Phone and website", Form: ContactForm, Icon: FiPhone },
  { id: "address", title: "Address", Form: AddressForm, Icon: FiMapPin },
  { id: "service_area", title: "Service area", Form: ServiceAreaForm, Icon: FiMap, wide: true },
  { id: "hours", title: "Opening hours", Form: HoursForm, Icon: FiClock },
  { id: "special_hours", title: "Special hours", Form: SpecialHoursForm, Icon: FiCalendar },
  { id: "more_hours", title: "More hours", Form: MoreHoursForm, Icon: FiWatch },
  { id: "open_status", title: "Open status", Form: OpenStatusForm, Icon: FiCheckCircle },
  { id: "services", title: "Services", Form: ServicesForm, Icon: FiList, wide: true },
  { id: "attributes", title: "Attributes", Form: AttributesForm, Icon: FiSliders, wide: true },
];

// The cards in four groups, so the profile reads the way Google shows it.
const GROUPS = [
  { id: "basics", title: "Basics", sections: ["name", "categories", "description"] },
  { id: "contact", title: "Contact and location", sections: ["contact", "address", "service_area"] },
  { id: "hours", title: "Hours", sections: ["hours", "special_hours", "more_hours", "open_status"] },
  { id: "extras", title: "Services and extras", sections: ["services", "attributes"] },
];

const MAX_TAGS = 10;

/** Short labels as tags; the rest counted ("+3 more"). */
function Tags({ items, empty }) {
  if (!items.length) return <p className="gp-e-summary gp-muted">{empty}</p>;
  return (
    <ul className="gp-e-tags">
      {items.slice(0, MAX_TAGS).map((item) => (
        <li key={item.key} className={`gp-e-tag${item.main ? " is-main" : ""}`}>
          {item.label}
          {item.main && <span className="gp-e-tag-note">Main</span>}
        </li>
      ))}
      {items.length > MAX_TAGS && <li className="gp-e-tag gp-e-tag-more">+{items.length - MAX_TAGS} more</li>}
    </ul>
  );
}

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
      return (
        <Tags
          empty="Not set"
          items={[
            ...(p.primary_category?.display_name ? [{ key: "main", label: p.primary_category.display_name, main: true }] : []),
            ...p.additional_categories.map((c, i) => ({ key: `${c.name || i}`, label: c.display_name })),
          ]}
        />
      );
    case "description":
      return text(p.description);
    case "contact": {
      const phones = [p.primary_phone, ...(p.additional_phones || [])].filter(Boolean);
      return (
        <dl className="gp-e-facts">
          <div>
            <dt>
              <FiPhone size={14} aria-hidden="true" /> Phone
            </dt>
            <dd>{phones.length ? phones.join(", ") : <span className="gp-muted">Not set</span>}</dd>
          </div>
          <div>
            <dt>
              <FiGlobe size={14} aria-hidden="true" /> Website
            </dt>
            <dd>
              {p.website ? (
                <a href={p.website} target="_blank" rel="noopener noreferrer" className="gp-e-link">
                  {p.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              ) : (
                <span className="gp-muted">Not set</span>
              )}
            </dd>
          </div>
        </dl>
      );
    }
    case "address": {
      const a = p.address;
      const lines = a
        ? [...(a.address_lines || []), [a.locality, a.administrative_area, a.postal_code].filter(Boolean).join(", ")].filter(Boolean)
        : [];
      if (!lines.length) return text("");
      return (
        <address className="gp-e-address">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </address>
      );
    }
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
      return (
        <Tags empty="No services on Google yet" items={p.services_on_google.map((s, i) => ({ key: `${s.label}-${i}`, label: s.label }))} />
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

      {GROUPS.map((group) => (
        <div key={group.id} className="gp-e-group" role="group" aria-labelledby={`gp-e-group-${group.id}`}>
          <h3 className="gp-e-group-title" id={`gp-e-group-${group.id}`}>
            {group.title}
          </h3>
          <div className="gp-e-sections">
            {group.sections.map((sid) => {
              const section = SECTIONS.find((s) => s.id === sid);
              const { id, title, Icon } = section;
              const Form = section.Form;
              const editing = open === id;
              return (
            <section
              key={id}
              className={`gp-e-sec${editing ? " is-editing" : ""}${section.wide || editing ? " is-wide" : ""}`}
              aria-labelledby={`gp-e-sec-${id}`}
            >
              <div className="gp-e-sec-head">
                <h4 className="gp-e-sec-title" id={`gp-e-sec-${id}`}>
                  <span className="gp-e-sec-icon" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  {title}
                  {RISKY.includes(id) && <span className="gp-e-sec-flag">Google reviews changes</span>}
                </h4>
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
        </div>
      ))}
      {open !== null && <p className="gp-note">Finish or cancel the section you're editing to edit another.</p>}
    </div>
  );
}
