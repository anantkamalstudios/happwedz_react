// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" tab — built by helper D: the score, the AI helper switch and the ordered next steps (use my
// storefront, keywords, services, photos, AI fixes, things only the vendor can do). Reuses FixesTab for the AI fixes.
import FixesTab from "./FixesTab";

export default function ImproveTab({ view, onOpenTab }) {
  return <FixesTab view={view} onOpenTab={onOpenTab} />;
}
