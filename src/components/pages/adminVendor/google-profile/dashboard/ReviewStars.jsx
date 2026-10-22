// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Star rating (1–5, halves for an average) with the number in words for screen readers. Helper D.
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function ReviewStars({ rating, size = 16 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));
  const rounded = Math.round(value * 2) / 2;
  const label = `${Number.isInteger(value) ? value : value.toFixed(1)} out of 5 stars`;
  return (
    <span className="gp-rv-stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => {
        const Icon = rounded >= n ? FaStar : rounded >= n - 0.5 ? FaStarHalfAlt : FaRegStar;
        return <Icon key={n} size={size} aria-hidden="true" focusable="false" />;
      })}
    </span>
  );
}
