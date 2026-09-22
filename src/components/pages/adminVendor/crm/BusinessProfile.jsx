import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { GST_RATES, INDIAN_STATES } from "./crmFormat";
import { Spinner } from "./crmUi";
import { useToast } from "../../../layouts/toasts/Toast";
import { resolveMediaUrl } from "../../../../config/constants";

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const FIELDS = [
  "legalName", "gstin", "pan", "address", "city", "state", "pincode", "phone", "email",
  "invoicePrefix", "quotationPrefix", "receiptPrefix", "defaultSac", "defaultGstRate", "bankDetails", "upiId", "terms",
  "reminderDaysBefore",
];
const SWITCHES = ["autoReminders", "dailyDigest"];

// What prints on the vendor's quotations, invoices and receipts.
const BusinessProfile = ({ onBack }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const logoInput = useRef(null);

  useEffect(() => {
    crmApi
      .profile()
      .then(({ profile }) => {
        const values = Object.fromEntries(FIELDS.map((f) => [f, profile[f] === null || profile[f] === undefined ? "" : String(profile[f])]));
        // The vendor's signup state may be spelt differently from the list ("maharashtra").
        const match = INDIAN_STATES.find((s) => s.toLowerCase() === values.state.trim().toLowerCase());
        if (match) values.state = match;
        values.defaultGstRate = String(Number(values.defaultGstRate || 18));
        for (const key of SWITCHES) values[key] = profile[key] !== false;
        setForm(values);
        setLogoUrl(profile.logoUrl || "");
      })
      .catch((err) => setError(errorMessage(err, "Could not load your business details.")));
  }, []);

  if (error && !form) return <div className="crm-card crm-empty"><h3>{error}</h3></div>;
  if (!form) return <Spinner />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const gstin = form.gstin.trim().toUpperCase();
    if (gstin && !GSTIN_RE.test(gstin)) return setError("GSTIN doesn't look right. It has 15 characters, like 27ABCDE1234F1Z5.");
    if (gstin && !form.state) return setError("Select your state. It decides whether invoices charge CGST + SGST or IGST.");
    if (gstin && form.state && INDIAN_STATE_CODES[form.state] && gstin.slice(0, 2) !== INDIAN_STATE_CODES[form.state]) {
      return setError(`A ${form.state} GSTIN starts with ${INDIAN_STATE_CODES[form.state]}. Check the GSTIN or the state.`);
    }
    setError("");
    setSaving(true);
    try {
      const result = await crmApi.saveProfile({
        ...form,
        gstin,
        defaultGstRate: Number(form.defaultGstRate),
        reminderDaysBefore: Number(form.reminderDaysBefore),
      });
      addToast(result.message, "success");
      onBack();
    } catch (err) {
      setError(errorMessage(err, "Could not save."));
      setSaving(false);
    }
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) return addToast("Use a PNG or JPG logo.", "error");
    if (file.size > 3 * 1024 * 1024) return addToast("The logo must be under 3 MB.", "error");
    setUploading(true);
    try {
      const result = await crmApi.uploadLogo(file);
      setLogoUrl(result.logoUrl);
      addToast("Logo updated.", "success");
    } catch (err) {
      addToast(errorMessage(err, "Could not upload the logo."), "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={save}>
      <button type="button" className="crm-back" onClick={onBack}><ArrowLeft size={15} /> Clients</button>
      <div className="crm-head">
        <div>
          <h1 className="crm-title">Business details</h1>
          <div className="crm-sub">Printed on your quotations, invoices and receipts.</div>
        </div>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
      </div>

      <div className="crm-cols">
        <div style={{ display: "grid", gap: 16 }}>
          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">Business</div>
            <div className="crm-field">
              <label className="crm-label">Logo</label>
              <div className="crm-logo-box">
                {logoUrl ? <img className="crm-logo" src={resolveMediaUrl(logoUrl)} alt="Logo" /> : <div className="crm-logo-empty"><ImagePlus size={22} /></div>}
                <div>
                  <button type="button" className="crm-btn crm-btn-sm" onClick={() => logoInput.current?.click()} disabled={uploading}>
                    {uploading ? "Uploading…" : logoUrl ? "Change logo" : "Upload logo"}
                  </button>
                  <div className="crm-hint">PNG or JPG, up to 3 MB. A square logo looks best.</div>
                </div>
                <input ref={logoInput} type="file" accept="image/png,image/jpeg" hidden onChange={uploadLogo} />
              </div>
            </div>
            <div className="crm-field">
              <label className="crm-label">Business name (as registered)</label>
              <input className="crm-input" value={form.legalName} onChange={set("legalName")} maxLength={200} />
            </div>
            <div className="crm-field">
              <label className="crm-label">Address</label>
              <textarea className="crm-input" value={form.address} onChange={set("address")} maxLength={500} style={{ minHeight: 60 }} />
            </div>
            <div className="crm-grid-3">
              <div className="crm-field">
                <label className="crm-label">City</label>
                <input className="crm-input" value={form.city} onChange={set("city")} maxLength={100} />
              </div>
              <div className="crm-field">
                <label className="crm-label">State</label>
                <select className="crm-input" value={form.state} onChange={set("state")}>
                  <option value="">Select</option>
                  {form.state && !INDIAN_STATES.includes(form.state) && <option value={form.state}>{form.state}</option>}
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="crm-field">
                <label className="crm-label">PIN code</label>
                <input className="crm-input" value={form.pincode} onChange={set("pincode")} inputMode="numeric" maxLength={10} />
              </div>
            </div>
            <div className="crm-grid-2">
              <div className="crm-field">
                <label className="crm-label">Phone</label>
                <input className="crm-input" value={form.phone} onChange={set("phone")} maxLength={20} />
              </div>
              <div className="crm-field">
                <label className="crm-label">Email</label>
                <input className="crm-input" type="email" value={form.email} onChange={set("email")} maxLength={150} />
                <div className="crm-hint">Client replies to your emails go here.</div>
              </div>
            </div>
          </div>

          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">Payment details</div>
            <div className="crm-field">
              <label className="crm-label">Bank details</label>
              <textarea className="crm-input" value={form.bankDetails} onChange={set("bankDetails")} placeholder={"Bank name\nAccount number\nIFSC"} maxLength={1000} />
            </div>
            <div className="crm-field">
              <label className="crm-label">UPI ID</label>
              <input className="crm-input" value={form.upiId} onChange={set("upiId")} placeholder="name@bank" maxLength={80} />
            </div>
            <div className="crm-field" style={{ marginBottom: 0 }}>
              <label className="crm-label">Default terms &amp; conditions</label>
              <textarea className="crm-input" value={form.terms} onChange={set("terms")} placeholder="e.g. 50% advance to confirm the booking. Balance before the event." maxLength={4000} style={{ minHeight: 100 }} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">GST</div>
            <div className="crm-field">
              <label className="crm-label">GSTIN</label>
              <input className="crm-input" value={form.gstin} onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value.toUpperCase() }))} placeholder="Leave empty if not registered" maxLength={15} style={{ textTransform: "uppercase" }} />
              <div className="crm-hint">With a GSTIN, invoices are tax invoices with CGST + SGST (client in your state) or IGST (other states). Without one, no GST is charged.</div>
            </div>
            <div className="crm-grid-2">
              <div className="crm-field">
                <label className="crm-label">PAN</label>
                <input className="crm-input" value={form.pan} onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value.toUpperCase() }))} maxLength={10} />
              </div>
              <div className="crm-field">
                <label className="crm-label">Default GST rate</label>
                <select className="crm-input" value={form.defaultGstRate} onChange={set("defaultGstRate")}>
                  {GST_RATES.map((r) => (
                    <option key={r} value={r}>{r}%</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="crm-field" style={{ marginBottom: 0 }}>
              <label className="crm-label">SAC code (optional)</label>
              <input className="crm-input" value={form.defaultSac} onChange={set("defaultSac")} placeholder="e.g. 998387" maxLength={8} />
            </div>
          </div>

          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">Reminders</div>
            <label className="crm-check" style={{ marginBottom: 6 }}>
              <input type="checkbox" checked={form.autoReminders} onChange={(e) => setForm((f) => ({ ...f, autoReminders: e.target.checked }))} />
              Email clients automatic payment reminders
            </label>
            <div className="crm-hint" style={{ marginTop: 0, marginBottom: 12 }}>
              Sent at 9 am to clients with a pending balance and a due date: before it, on the day, and 3 and 10 days after if still unpaid.
              They include your bank and UPI details. You can turn them off for a single client.
            </div>
            {form.autoReminders && (
              <div className="crm-field">
                <label className="crm-label">First reminder</label>
                <select className="crm-input" value={form.reminderDaysBefore} onChange={set("reminderDaysBefore")}>
                  <option value="0">Only on the due date</option>
                  <option value="1">1 day before</option>
                  <option value="2">2 days before</option>
                  <option value="3">3 days before</option>
                  <option value="5">5 days before</option>
                  <option value="7">7 days before</option>
                </select>
              </div>
            )}
            <label className="crm-check" style={{ marginBottom: 6 }}>
              <input type="checkbox" checked={form.dailyDigest} onChange={(e) => setForm((f) => ({ ...f, dailyDigest: e.target.checked }))} />
              Email me a daily summary
            </label>
            <div className="crm-hint" style={{ marginTop: 0 }}>
              Each morning when there's something to do: follow-ups due, payments due or overdue, and events in the next 3 days.
            </div>
          </div>

          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">Numbering</div>
            <div className="crm-muted crm-small" style={{ marginBottom: 12 }}>
              Numbers run in order each financial year, e.g. {form.invoicePrefix || "INV"}/26-27/001. Up to 5 letters or numbers.
            </div>
            <div className="crm-grid-3">
              <div className="crm-field">
                <label className="crm-label">Invoice</label>
                <input className="crm-input" value={form.invoicePrefix} onChange={set("invoicePrefix")} maxLength={5} />
              </div>
              <div className="crm-field">
                <label className="crm-label">Quotation</label>
                <input className="crm-input" value={form.quotationPrefix} onChange={set("quotationPrefix")} maxLength={5} />
              </div>
              <div className="crm-field">
                <label className="crm-label">Receipt</label>
                <input className="crm-input" value={form.receiptPrefix} onChange={set("receiptPrefix")} maxLength={5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="crm-notice crm-notice-warn" style={{ marginTop: 16 }}>{error}</div>}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
      </div>
    </form>
  );
};

// First two digits of a GSTIN by state.
const INDIAN_STATE_CODES = {
  "Jammu and Kashmir": "01", "Himachal Pradesh": "02", Punjab: "03", Chandigarh: "04", Uttarakhand: "05", Haryana: "06",
  Delhi: "07", Rajasthan: "08", "Uttar Pradesh": "09", Bihar: "10", Sikkim: "11", "Arunachal Pradesh": "12", Nagaland: "13",
  Manipur: "14", Mizoram: "15", Tripura: "16", Meghalaya: "17", Assam: "18", "West Bengal": "19", Jharkhand: "20",
  Odisha: "21", Chhattisgarh: "22", "Madhya Pradesh": "23", Gujarat: "24", "Dadra and Nagar Haveli and Daman and Diu": "26",
  Maharashtra: "27", Karnataka: "29", Goa: "30", Lakshadweep: "31", Kerala: "32", "Tamil Nadu": "33", Puducherry: "34",
  "Andaman and Nicobar Islands": "35", Telangana: "36", "Andhra Pradesh": "37", Ladakh: "38",
};

export default BusinessProfile;
