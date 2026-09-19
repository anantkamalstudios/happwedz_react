import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheck, FiImage } from "react-icons/fi";
import { einviteApi } from "../../../services/api/einviteApi";
import EinviteTemplateTile from "./EinviteTemplateTile";
import { CARD_TYPES, CULTURES, THEMES } from "./design/einviteDesign";
import "./einviteStudio.css";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name (A–Z)" },
];
// Video designs have prices, so they can also be sorted and filtered by price.
const VIDEO_SORT_OPTIONS = [
  ...SORT_OPTIONS,
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];
const PRICE_OPTIONS = [
  { value: "", label: "Any price" },
  { value: "free", label: "Free" },
  { value: "under1000", label: "Under ₹1,000" },
  { value: "1000to2000", label: "₹1,000 – ₹2,000" },
  { value: "over2000", label: "Over ₹2,000" },
];

const pickAllowed = (value, allowed, fallback = "") => (allowed.includes(value) ? value : fallback);

// Text-style dropdown for the filter bar. Shows the plain label until a filter
// is chosen, then "Label: Value" highlighted.
const FilterDropdown = ({ label, value, options, onChange, alwaysHighlighted = false, alignEnd = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const isFiltered = Boolean(value) && !alwaysHighlighted;
  const buttonText = isFiltered && selected ? `${label}: ${selected.label}` : label;

  return (
    <div className="eiv-filter" ref={containerRef}>
      <button
        type="button"
        className={`eiv-filter-toggle ${alwaysHighlighted || isFiltered ? "is-active" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="text-truncate">{buttonText}</span>
        <span className="eiv-caret" aria-hidden="true" />
      </button>
      {open && (
        <ul className={`eiv-filter-menu ${alignEnd ? "is-end" : ""}`} role="listbox" aria-label={label}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value || "all"} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={isSelected ? "is-selected" : ""}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {isSelected && <FiCheck size={15} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// Filters live in the URL (?sort=&culture=&theme=) so a filtered list can be shared.
const EinviteCatalog = ({ cardType, onCardTypeChange, showBreadcrumb = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isVideo = cardType === "video";
  const sortOptions = isVideo ? VIDEO_SORT_OPTIONS : SORT_OPTIONS;
  const sort = pickAllowed(searchParams.get("sort"), sortOptions.map((o) => o.value), "popular");
  const price = isVideo ? pickAllowed(searchParams.get("price"), PRICE_OPTIONS.map((o) => o.value)) : "";
  const priceLabel = PRICE_OPTIONS.find((o) => o.value === price)?.label;
  const culture = pickAllowed(searchParams.get("culture"), CULTURES);
  const theme = pickAllowed(searchParams.get("theme"), THEMES);

  const [cards, setCards] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const typeInfo = CARD_TYPES.find((type) => type.value === cardType) || CARD_TYPES[0];

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && !(key === "sort" && value === "popular")) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("culture");
    next.delete("theme");
    next.delete("price");
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    einviteApi
      .getTemplates({ cardType, culture, theme, price, sort, page: 1, limit: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setCards(result?.data || []);
        setTotal(result?.pagination?.total || 0);
        setPage(1);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load invitation designs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cardType, culture, theme, price, sort, reloadKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await einviteApi.getTemplates({
        cardType,
        culture,
        theme,
        price,
        sort,
        page: page + 1,
        limit: PAGE_SIZE,
      });
      setCards((prev) => [...prev, ...(result?.data || [])]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message || "Failed to load more designs");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="eiv">
      <div className="eiv-filterbar">
        <div className="eiv-filterbar-inner" style={isVideo ? { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" } : undefined}>
          <FilterDropdown
            label="Sort By"
            value={sort}
            options={sortOptions}
            onChange={(value) => setFilter("sort", value)}
            alwaysHighlighted
          />
          {isVideo && (
            <FilterDropdown label="Price" value={price} options={PRICE_OPTIONS} onChange={(value) => setFilter("price", value)} />
          )}
          <FilterDropdown
            label="Culture"
            value={culture}
            options={[{ value: "", label: "All cultures" }, ...CULTURES.map((c) => ({ value: c, label: c }))]}
            onChange={(value) => setFilter("culture", value)}
          />
          <FilterDropdown
            label="Theme"
            value={theme}
            options={[{ value: "", label: "All themes" }, ...THEMES.map((t) => ({ value: t, label: t }))]}
            onChange={(value) => setFilter("theme", value)}
            alignEnd
          />
        </div>
      </div>

      <div className="container eiv-catalog-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            {showBreadcrumb && (
              <nav className="eiv-breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span>›</span>
                <Link to="/einvites">Invitation Cards</Link>
                <span>›</span>
                <span>{typeInfo.title}</span>
              </nav>
            )}
            <h1 className="eiv-title">
              {typeInfo.title}
              {!loading && <span className="eiv-count">{total} {total === 1 ? "Item" : "Items"}</span>}
            </h1>
          </div>
          <Link to="/einvites/my-cards" className="eiv-outline-btn">
            <FiImage size={16} /> Your Cards
          </Link>
        </div>

        <div className="eiv-tabs" role="tablist">
          {CARD_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              role="tab"
              aria-selected={type.value === cardType}
              className={`eiv-tab ${type.value === cardType ? "is-active" : ""}`}
              onClick={() => onCardTypeChange(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {(culture || theme || price) && (
          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            {culture && (
              <span className="eiv-chip">
                {culture}
                <button type="button" aria-label={`Remove ${culture}`} onClick={() => setFilter("culture", "")}>×</button>
              </span>
            )}
            {theme && (
              <span className="eiv-chip">
                {theme}
                <button type="button" aria-label={`Remove ${theme}`} onClick={() => setFilter("theme", "")}>×</button>
              </span>
            )}
            {price && (
              <span className="eiv-chip">
                {priceLabel}
                <button type="button" aria-label={`Remove ${priceLabel}`} onClick={() => setFilter("price", "")}>×</button>
              </span>
            )}
            <button type="button" className="eiv-link-btn" onClick={clearFilters}>Clear all</button>
          </div>
        )}

        {loading ? (
          <div className="eiv-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="eiv-skeleton" />
            ))}
          </div>
        ) : error && cards.length === 0 ? (
          <div className="eiv-empty">
            <h3>Couldn't load designs</h3>
            <p>{error}</p>
            <button type="button" className="eiv-outline-btn" onClick={() => setReloadKey((k) => k + 1)}>
              Try again
            </button>
          </div>
        ) : cards.length === 0 ? (
          <div className="eiv-empty">
            <h3>{cardType === "video" ? "Video invitations are coming soon" : "No designs match these filters"}</h3>
            <p>
              {culture || theme
                ? "Try a different culture or theme."
                : "New designs are added regularly. Please check back soon."}
            </p>
            {(culture || theme || price) && (
              <button type="button" className="eiv-outline-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="eiv-grid">
              {cards.map((card) => (
                <EinviteTemplateTile key={card.id} card={card} />
              ))}
            </div>
            {cards.length < total && (
              <div className="text-center mt-5">
                <button type="button" className="eiv-outline-btn" onClick={loadMore} disabled={loadingMore}>
                  {loadingMore ? "Loading..." : "Load more designs"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// For pages that show the catalogue without their own route per card type.
export const EinviteCatalogSection = ({ initialCardType = "wedding_einvite" }) => {
  const [cardType, setCardType] = useState(initialCardType);
  return <EinviteCatalog cardType={cardType} onCardTypeChange={setCardType} showBreadcrumb={false} />;
};

export default EinviteCatalog;
