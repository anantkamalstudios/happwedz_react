import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { GST_RATES, computeTotals, rupees, toPaise } from "./crmFormat";
import { blankItem } from "./itemRows";
import { RupeeInput } from "./crmUi";

/**
 * Line items with live totals. taxMode: "none" | "intra" | "inter".
 */
const ItemsEditor = ({ items, setItems, taxMode, discount, setDiscount, defaultGstRate = 18 }) => {
  const showTax = taxMode !== "none";
  const update = (key, field, value) => setItems((list) => list.map((item) => (item.key === key ? { ...item, [field]: value } : item)));
  const discountPaise = toPaise(discount);
  const totals = computeTotals(items, Number.isNaN(discountPaise) ? 0 : discountPaise, taxMode);

  return (
    <>
      <div className="crm-table-wrap">
        <table className="crm-items">
          <thead>
            <tr>
              <th style={{ minWidth: 220 }}>Description</th>
              <th style={{ width: 70 }}>Qty</th>
              <th style={{ width: 130 }}>Rate</th>
              {showTax && <th style={{ width: 84 }}>GST</th>}
              <th style={{ width: 110, textAlign: "right" }}>Amount</th>
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.key}>
                <td>
                  <input
                    className="crm-input"
                    value={item.description}
                    onChange={(e) => update(item.key, "description", e.target.value)}
                    placeholder="e.g. Haldi – candid photography"
                    maxLength={300}
                    aria-label={`Item ${index + 1} description`}
                  />
                </td>
                <td>
                  <input
                    className="crm-input"
                    inputMode="decimal"
                    value={item.quantity}
                    onChange={(e) => update(item.key, "quantity", e.target.value.replace(/[^\d.]/g, ""))}
                    aria-label="Quantity"
                  />
                </td>
                <td>
                  <RupeeInput value={item.rate} onChange={(value) => update(item.key, "rate", value)} aria-label="Rate" />
                </td>
                {showTax && (
                  <td>
                    <select className="crm-input" value={item.gstRate} onChange={(e) => update(item.key, "gstRate", e.target.value)} aria-label="GST rate">
                      {GST_RATES.map((rate) => (
                        <option key={rate} value={rate}>{rate}%</option>
                      ))}
                    </select>
                  </td>
                )}
                <td className="crm-items-amount">{rupees(totals.lines[index]?.amountPaise || 0, { decimals: true })}</td>
                <td>
                  <button
                    type="button"
                    className="crm-icon-btn"
                    onClick={() => setItems((list) => list.filter((x) => x.key !== item.key))}
                    disabled={items.length === 1}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="crm-btn crm-btn-sm" onClick={() => setItems((list) => [...list, blankItem(defaultGstRate)])} style={{ margin: "6px 0 16px" }}>
        <Plus size={14} /> Add item
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: 200 }}>
          <label className="crm-label">Discount</label>
          <RupeeInput value={discount} onChange={setDiscount} />
        </div>
        <div className="crm-totals">
          <div><span className="crm-muted">Subtotal</span><span>{rupees(totals.subtotal, { decimals: true })}</span></div>
          {totals.discount > 0 && <div><span className="crm-muted">Discount</span><span>− {rupees(totals.discount, { decimals: true })}</span></div>}
          {taxMode === "intra" && (
            <>
              <div><span className="crm-muted">CGST</span><span>{rupees(totals.cgst, { decimals: true })}</span></div>
              <div><span className="crm-muted">SGST</span><span>{rupees(totals.sgst, { decimals: true })}</span></div>
            </>
          )}
          {taxMode === "inter" && <div><span className="crm-muted">IGST</span><span>{rupees(totals.igst, { decimals: true })}</span></div>}
          <div className="is-total"><span>Total</span><span>{rupees(totals.total, { decimals: true })}</span></div>
        </div>
      </div>
    </>
  );
};

export default ItemsEditor;
