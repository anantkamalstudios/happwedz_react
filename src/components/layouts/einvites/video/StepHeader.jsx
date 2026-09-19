import React from "react";
import { FiCheck } from "react-icons/fi";

// Choose Video → Enter Details → Complete Payment (paid designs) or Review →
// Get Video Instantly. `current` is the 1-based active step.
const videoSteps = (isPaid) => [
  "Choose\nVideo",
  "Enter\nDetails",
  isPaid ? "Complete\nPayment" : "Review\nDetails",
  "Get Video\nInstantly",
];

const StepHeader = ({ current, isPaid }) => (
  <ol className="eiv-steps" aria-label="Steps">
    {videoSteps(isPaid).map((label, index) => {
      const step = index + 1;
      const state = step < current ? "is-done" : step === current ? "is-active" : "";
      return (
        <li key={label} className={`eiv-step ${state}`} aria-current={step === current ? "step" : undefined}>
          <span className="eiv-step-dot">{step < current ? <FiCheck size={14} /> : step}</span>
          <span className="eiv-step-label">{label}</span>
        </li>
      );
    })}
  </ol>
);

export default StepHeader;
