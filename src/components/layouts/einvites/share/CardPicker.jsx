import React from "react";
import { pageTitle } from "../design/einviteDesign";

// Checkboxes for the cards (functions) a link or message includes.
// `selected` is a list of page ids.
const CardPicker = ({ pages, selected, onChange, idPrefix }) => {
  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);

  return (
    <div className="eiv-card-picker">
      {pages.map((page, index) => (
        <label key={page.id} htmlFor={`${idPrefix}-${page.id}`} className={selected.includes(page.id) ? "is-on" : ""}>
          <input
            id={`${idPrefix}-${page.id}`}
            type="checkbox"
            checked={selected.includes(page.id)}
            onChange={() => toggle(page.id)}
          />
          {pageTitle(page, index)}
        </label>
      ))}
    </div>
  );
};

export default CardPicker;
