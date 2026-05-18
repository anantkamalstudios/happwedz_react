import React, { useCallback, useMemo } from "react";
import { Accordion, Form } from "react-bootstrap";
import {
  VENDOR_TYPE,
  STORE_PRESENCE,
  STORE_ACCESS_TYPE,
  YEARS_OF_EXPERIENCE,
  INVENTORY_SPECIALIZATION,
  RENTAL_TYPES,
  TRIAL_AVAILABILITY,
  CUSTOMIZATION_ALTERATION,
  ACCESSORY_RENTAL,
  YES_NO,
  LEHENGA_STYLES,
  OCCASION_SUITABILITY,
  WORK_TYPE,
  FABRIC_OPTIONS,
  COLOR_PALETTE,
  DESIGNER_AVAILABILITY,
  DUPATTA_STYLES,
  SIZE_RANGE,
  ADJUSTABILITY_RANGE,
  WEIGHT_CATEGORY,
  BLOUSE_TYPE,
  DUPATTA_LENGTH,
  CONDITION_QUALITY,
  PRICE_RANGE,
  DEPOSIT_AMOUNT_RANGE,
  DAMAGE_POLICY,
  CLEANING_CHARGES,
  TRIAL_CHARGES,
  INVENTORY_SIZE,
  DAILY_TRIAL_CAPACITY,
  SIMULTANEOUS_RENTALS_CAPACITY,
  BOOKING_WINDOW,
  FITTING_TIMELINE,
  PICKUP_TIMING,
  RETURN_TIMELINE,
  PAYMENT_MODES,
  ADVANCE_PAYMENT,
  STYLE_TAGS,
  AUDIENCE_TAGS,
  USAGE_TAGS,
  PRICE_SEGMENT_TAGS,
  emptyRentalOutfitMaster,
} from "./rentalOutfitMasterConstants";

function mergeDeep(base, patch) {
  const out = { ...base };
  Object.keys(patch || {}).forEach((k) => {
    const pv = patch[k];
    const bv = base[k];
    if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[k] = mergeDeep(bv, pv);
    } else out[k] = pv;
  });
  return out;
}

const SelectField = ({ label, options, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <Form.Select
      className="fs-14"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </Form.Select>
  </div>
);

const MultiCheck = ({ label, options, value, onChange }) => {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (opt) =>
    onChange(
      selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt]
    );
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <div className="d-flex flex-wrap gap-2">
        {options.map((opt) => (
          <Form.Check
            key={opt}
            type="checkbox"
            label={opt}
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="fs-14"
          />
        ))}
      </div>
    </div>
  );
};

const YesNoField = ({ label, value, onChange, groupName }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold">{label}</label>
    <div className="d-flex gap-3">
      {YES_NO.map((y) => (
        <Form.Check
          key={y}
          type="radio"
          name={groupName}
          label={y}
          checked={value === y}
          onChange={() => onChange(y)}
        />
      ))}
    </div>
  </div>
);

const RentalOutfitMasterProfile = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
  embedded = false,
}) => {
  const jm = useMemo(() => {
    const raw =
      formData.rental_outfit_master || formData.attributes?.rental_outfit_master;
    if (raw && typeof raw === "object")
      return mergeDeep(emptyRentalOutfitMaster(), raw);
    return emptyRentalOutfitMaster();
  }, [formData.rental_outfit_master, formData.attributes?.rental_outfit_master]);

  const patchJm = useCallback(
    (partial) => {
      setFormData((prev) => {
        const next = mergeDeep(
          prev.rental_outfit_master ||
            prev.attributes?.rental_outfit_master ||
            emptyRentalOutfitMaster(),
          partial
        );
        return {
          ...prev,
          rental_outfit_master: next,
          attributes: { ...(prev.attributes || {}), rental_outfit_master: next },
        };
      });
    },
    [setFormData]
  );

  return (
    <>
      <h4 className="mb-2 fw-bold">Bridal Outfit On Rent Master Profile</h4>
      <Accordion alwaysOpen flush defaultActiveKey={["0", "1"]}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Section 1 — Basic Identity</Accordion.Header>
          <Accordion.Body>
            <SelectField label="Vendor Type" options={VENDOR_TYPE} value={jm.identity.vendor_type} onChange={(v) => patchJm({ identity: { ...jm.identity, vendor_type: v } })} />
            <div className="mb-3">
              <label className="form-label fw-semibold">Brand Name</label>
              <Form.Control
                className="fs-14"
                value={jm.identity.brand_name}
                onChange={(e) =>
                  patchJm({
                    identity: { ...jm.identity, brand_name: e.target.value },
                  })
                }
              />
            </div>
            <MultiCheck label="Store Presence" options={STORE_PRESENCE} value={jm.identity.store_presence} onChange={(v) => patchJm({ identity: { ...jm.identity, store_presence: v } })} />
            <SelectField label="Store Access Type" options={STORE_ACCESS_TYPE} value={jm.identity.store_access_type} onChange={(v) => patchJm({ identity: { ...jm.identity, store_access_type: v } })} />
            <SelectField label="Years of Experience" options={YEARS_OF_EXPERIENCE} value={jm.identity.years_of_experience} onChange={(v) => patchJm({ identity: { ...jm.identity, years_of_experience: v } })} />
            <MultiCheck label="Inventory Specialization" options={INVENTORY_SPECIALIZATION} value={jm.identity.inventory_specialization} onChange={(v) => patchJm({ identity: { ...jm.identity, inventory_specialization: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Section 2 — Services Offered</Accordion.Header>
          <Accordion.Body>
            <MultiCheck label="Rental Types" options={RENTAL_TYPES} value={jm.services.rental_types} onChange={(v) => patchJm({ services: { ...jm.services, rental_types: v } })} />
            <SelectField label="Trial Availability" options={TRIAL_AVAILABILITY} value={jm.services.trial_availability} onChange={(v) => patchJm({ services: { ...jm.services, trial_availability: v } })} />
            <SelectField label="Customization / Alteration" options={CUSTOMIZATION_ALTERATION} value={jm.services.customization_alteration} onChange={(v) => patchJm({ services: { ...jm.services, customization_alteration: v } })} />
            <YesNoField label="Styling Assistance" value={jm.services.styling_assistance} onChange={(v) => patchJm({ services: { ...jm.services, styling_assistance: v } })} groupName="ro_style"/>
            <MultiCheck label="Accessory Rental Available" options={ACCESSORY_RENTAL} value={jm.services.accessory_rental} onChange={(v) => patchJm({ services: { ...jm.services, accessory_rental: v } })} />
            <YesNoField label="Dry Cleaning Included" value={jm.services.dry_cleaning_included} onChange={(v) => patchJm({ services: { ...jm.services, dry_cleaning_included: v } })} groupName="ro_dry"/>
            <YesNoField label="Pickup & Delivery Service" value={jm.services.pickup_delivery} onChange={(v) => patchJm({ services: { ...jm.services, pickup_delivery: v } })} groupName="ro_pickup"/>
            <YesNoField label="Urgent Rental Availability" value={jm.services.urgent_rental} onChange={(v) => patchJm({ services: { ...jm.services, urgent_rental: v } })} groupName="ro_urgent"/>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Section 3 — Core Intelligence</Accordion.Header>
          <Accordion.Body>
            <MultiCheck label="Lehenga Styles Available" options={LEHENGA_STYLES} value={jm.core_intelligence.lehenga_styles} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, lehenga_styles: v } })} />
            <MultiCheck label="Occasion Suitability" options={OCCASION_SUITABILITY} value={jm.core_intelligence.occasion_suitability} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, occasion_suitability: v } })} />
            <MultiCheck label="Work Type" options={WORK_TYPE} value={jm.core_intelligence.work_type} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, work_type: v } })} />
            <MultiCheck label="Fabric Options" options={FABRIC_OPTIONS} value={jm.core_intelligence.fabric_options} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, fabric_options: v } })} />
            <MultiCheck label="Color Palette" options={COLOR_PALETTE} value={jm.core_intelligence.color_palette} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, color_palette: v } })} />
            <MultiCheck label="Designer Availability" options={DESIGNER_AVAILABILITY} value={jm.core_intelligence.designer_availability} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, designer_availability: v } })} />
            <MultiCheck label="Dupatta Styles" options={DUPATTA_STYLES} value={jm.core_intelligence.dupatta_styles} onChange={(v) => patchJm({ core_intelligence: { ...jm.core_intelligence, dupatta_styles: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Section 4 — Technical / Product / Skill Layer</Accordion.Header>
          <Accordion.Body>
            <SelectField label="Size Range Available" options={SIZE_RANGE} value={jm.technical_product.size_range} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, size_range: v } })} />
            <SelectField label="Adjustability Range" options={ADJUSTABILITY_RANGE} value={jm.technical_product.adjustability_range} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, adjustability_range: v } })} />
            <SelectField label="Lehenga Weight Category" options={WEIGHT_CATEGORY} value={jm.technical_product.weight_category} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, weight_category: v } })} />
            <MultiCheck label="Blouse Type" options={BLOUSE_TYPE} value={jm.technical_product.blouse_type} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, blouse_type: v } })} />
            <YesNoField label="Can-Can Included" value={jm.technical_product.can_can_included} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, can_can_included: v } })} groupName="ro_cancan"/>
            <SelectField label="Dupatta Length Options" options={DUPATTA_LENGTH} value={jm.technical_product.dupatta_length} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, dupatta_length: v } })} />
            <SelectField label="Condition Quality" options={CONDITION_QUALITY} value={jm.technical_product.condition_quality} onChange={(v) => patchJm({ technical_product: { ...jm.technical_product, condition_quality: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>Section 5 — Pricing Logic</Accordion.Header>
          <Accordion.Body>
            <SelectField label="Rental Price Range" options={PRICE_RANGE} value={jm.pricing_logic.price_range} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, price_range: v } })} />
            <YesNoField label="Security Deposit Required" value={jm.pricing_logic.security_deposit_required} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, security_deposit_required: v } })} groupName="ro_sec_dep"/>
            <SelectField label="Deposit Amount Range" options={DEPOSIT_AMOUNT_RANGE} value={jm.pricing_logic.deposit_amount_range} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, deposit_amount_range: v } })} />
            <YesNoField label="Late Return Charges" value={jm.pricing_logic.late_return_charges} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, late_return_charges: v } })} groupName="ro_late"/>
            <SelectField label="Damage Policy" options={DAMAGE_POLICY} value={jm.pricing_logic.damage_policy} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, damage_policy: v } })} />
            <SelectField label="Cleaning Charges" options={CLEANING_CHARGES} value={jm.pricing_logic.cleaning_charges} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, cleaning_charges: v } })} />
            <SelectField label="Trial Charges" options={TRIAL_CHARGES} value={jm.pricing_logic.trial_charges} onChange={(v) => patchJm({ pricing_logic: { ...jm.pricing_logic, trial_charges: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Section 6 — Scale & Capacity</Accordion.Header>
          <Accordion.Body>
            <SelectField label="Inventory Size" options={INVENTORY_SIZE} value={jm.scale_capacity.inventory_size} onChange={(v) => patchJm({ scale_capacity: { ...jm.scale_capacity, inventory_size: v } })} />
            <SelectField label="Daily Trial Capacity" options={DAILY_TRIAL_CAPACITY} value={jm.scale_capacity.daily_trial_capacity} onChange={(v) => patchJm({ scale_capacity: { ...jm.scale_capacity, daily_trial_capacity: v } })} />
            <SelectField label="Simultaneous Rentals Capacity" options={SIMULTANEOUS_RENTALS_CAPACITY} value={jm.scale_capacity.simultaneous_rentals_capacity} onChange={(v) => patchJm({ scale_capacity: { ...jm.scale_capacity, simultaneous_rentals_capacity: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Section 7 — Workflow & Booking</Accordion.Header>
          <Accordion.Body>
            <YesNoField label="Advance Booking Required" value={jm.workflow_booking.advance_booking_required} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, advance_booking_required: v } })} groupName="ro_adv_book"/>
            <SelectField label="Booking Window" options={BOOKING_WINDOW} value={jm.workflow_booking.booking_window} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, booking_window: v } })} />
            <YesNoField label="Trial Appointment Required" value={jm.workflow_booking.trial_appointment_required} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, trial_appointment_required: v } })} groupName="ro_trial_app"/>
            <SelectField label="Fitting Timeline Before Event" options={FITTING_TIMELINE} value={jm.workflow_booking.fitting_timeline} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, fitting_timeline: v } })} />
            <SelectField label="Pickup Timing" options={PICKUP_TIMING} value={jm.workflow_booking.pickup_timing} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, pickup_timing: v } })} />
            <SelectField label="Return Timeline" options={RETURN_TIMELINE} value={jm.workflow_booking.return_timeline} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, return_timeline: v } })} />
            <MultiCheck label="Payment Modes" options={PAYMENT_MODES} value={jm.workflow_booking.payment_modes} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, payment_modes: v } })} />
            <SelectField label="Advance Payment Percentage" options={ADVANCE_PAYMENT} value={jm.workflow_booking.advance_payment_percent} onChange={(v) => patchJm({ workflow_booking: { ...jm.workflow_booking, advance_payment_percent: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>Section 8 — Portfolio Tagging</Accordion.Header>
          <Accordion.Body>
            <MultiCheck label="Style Tags" options={STYLE_TAGS} value={jm.ai_tags.style_tags} onChange={(v) => patchJm({ ai_tags: { ...jm.ai_tags, style_tags: v } })} />
            <MultiCheck label="Audience Tags" options={AUDIENCE_TAGS} value={jm.ai_tags.audience_tags} onChange={(v) => patchJm({ ai_tags: { ...jm.ai_tags, audience_tags: v } })} />
            <MultiCheck label="Usage Tags" options={USAGE_TAGS} value={jm.ai_tags.usage_tags} onChange={(v) => patchJm({ ai_tags: { ...jm.ai_tags, usage_tags: v } })} />
            <SelectField label="Price Segment Tags" options={PRICE_SEGMENT_TAGS} value={jm.ai_tags.price_segment_tags} onChange={(v) => patchJm({ ai_tags: { ...jm.ai_tags, price_segment_tags: v } })} />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>Section 9 — AI FAQ</Accordion.Header>
          <Accordion.Body>
            <YesNoField label="Do you provide bridal lehengas on rent?" value={jm.ai_faq.bridal_lehengas_rent} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, bridal_lehengas_rent: v } })} groupName="ro_f1"/>
            <YesNoField label="Is alteration included in rental?" value={jm.ai_faq.alteration_included} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, alteration_included: v } })} groupName="ro_f2"/>
            <YesNoField label="Do you offer designer lehengas on rent?" value={jm.ai_faq.designer_lehengas_rent} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, designer_lehengas_rent: v } })} groupName="ro_f3"/>
            <YesNoField label="Is security deposit required?" value={jm.ai_faq.security_deposit_required} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, security_deposit_required: v } })} groupName="ro_f4"/>
            <YesNoField label="Can I get lehenga on rent under ₹10,000?" value={jm.ai_faq.rent_under_10k} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, rent_under_10k: v } })} groupName="ro_f5"/>
            <YesNoField label="Do you provide home trials?" value={jm.ai_faq.home_trials} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, home_trials: v } })} groupName="ro_f6"/>
            <YesNoField label="Is dry cleaning included in rental price?" value={jm.ai_faq.dry_cleaning_included} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, dry_cleaning_included: v } })} groupName="ro_f7"/>
            <YesNoField label="Are plus sizes available?" value={jm.ai_faq.plus_sizes} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, plus_sizes: v } })} groupName="ro_f8"/>
            <YesNoField label="Can I rent lehenga for multiple days?" value={jm.ai_faq.multiple_days} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, multiple_days: v } })} groupName="ro_f9"/>
            <YesNoField label="Do you provide accessories with lehenga?" value={jm.ai_faq.accessories_included} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, accessories_included: v } })} groupName="ro_f10"/>
            <YesNoField label="Is urgent rental available within 3 days?" value={jm.ai_faq.urgent_rental_3_days} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, urgent_rental_3_days: v } })} groupName="ro_f11"/>
            <YesNoField label="Do you allow size adjustments?" value={jm.ai_faq.size_adjustments} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, size_adjustments: v } })} groupName="ro_f12"/>
            <YesNoField label="Is pickup and delivery available?" value={jm.ai_faq.pickup_delivery} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, pickup_delivery: v } })} groupName="ro_f13"/>
            <YesNoField label="Are heavy bridal lehengas available?" value={jm.ai_faq.heavy_bridal} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, heavy_bridal: v } })} groupName="ro_f14"/>
            <YesNoField label="Is trial mandatory before booking?" value={jm.ai_faq.trial_mandatory} onChange={(v) => patchJm({ ai_faq: { ...jm.ai_faq, trial_mandatory: v } })} groupName="ro_f15"/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default RentalOutfitMasterProfile;
