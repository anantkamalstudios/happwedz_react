import { ClipLoader } from "react-spinners";

export const SLIDER_CATEGORIES = [
  "foundation",
  "concealer",
  "blush",
  "contour",
  "kajal",
  "eyeshadow",
  "lipstick",
  "bindi",
  "mascara",
  "eyeliner",
  // "mangtika",
  "contactlenses",
];

export const buttons = ["Shades", "Compare", "Complete Look"];

// Default intensity values for each category
export const DEFAULT_INTENSITIES = {
  foundation: 0.6,
  concealer: 0.9,
  blush: 0.2,
  contour: 0.3,
  kajal: 1.0,
  eyeshadow: 0.4,
  lipstick: 0.8,
  bindi: 6,
  mascara: 0.8,
  eyeliner: 0.5,
  // mangtika: 0.6,
  contactlenses: 0.2,
};

export const Loader = () => {
  return (
    <div
      className="filters-container my-5 d-flex align-items-center justify-content-center"
      style={{ minHeight: 400 }}
    >
      <ClipLoader size={60} color="#ed1173" />
    </div>
  );
};
