import React, { useEffect, useState } from "react";
import { STORE_API_URL, STORE_ORIGIN } from "../../config/constants";

// "Also on the HappyWedz Store" — the products this vendor sells in the shop,
// on their own profile page.
//
// A couple looking at a photographer's or a boutique's profile can see what
// they sell and buy it, instead of the two sites being strangers to each other.
//
// The store answers this itself (GET /api/sellers/by-hw/<vendors.id>); it is a
// public, cached, read-only endpoint and needs no sign-in. A vendor who has
// never sold on the store, or whose shop is suspended, comes back with
// `selling: false` and this renders nothing at all.

const rupees = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function VendorStoreProducts({ vendorId, vendorName, onLoaded }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!vendorId) return undefined;
    let alive = true;
    const controller = new AbortController();

    fetch(`${STORE_API_URL}/sellers/by-hw/${vendorId}?limit=8`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive) return;
        setData(d);
        // The tab bar only shows "Shop" once we know there is one.
        if (typeof onLoaded === "function") onLoaded(!!d?.selling);
      })
      .catch(() => {
        // The shop being unreachable must never break the profile page.
        if (alive && typeof onLoaded === "function") onLoaded(false);
      });

    return () => {
      alive = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  if (!data?.selling) return null;

  const { seller, products, total, away } = data;
  const shopUrl = seller?.url || `${STORE_ORIGIN}/`;

  return (
    <div id="shop" className="vendor-store-section" data-testid="vendor-store">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-1">Shop {vendorName || seller?.name}</h3>
          <p className="text-muted mb-0" style={{ fontSize: 14 }}>
            {total > 0
              ? `${total} ${total === 1 ? "product" : "products"} on the HappyWedz Store`
              : "On the HappyWedz Store"}
          </p>
        </div>
        <a
          href={shopUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-primary btn-sm"
          data-testid="vendor-store-link"
        >
          Visit their shop
        </a>
      </div>

      {away ? (
        <div className="alert alert-warning mb-0" data-testid="vendor-store-away">
          <p className="mb-0">{away.text}</p>
          {away.message && <p className="mb-0 mt-1 fst-italic">“{away.message}”</p>}
        </div>
      ) : (
        <>
          <div className="row g-3" data-testid="vendor-store-products">
            {products.map((p) => (
              <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="d-block h-100 text-decoration-none text-reset vendor-store-card"
                  data-testid="vendor-store-product"
                >
                  <div
                    className="position-relative mb-2 overflow-hidden rounded"
                    style={{ aspectRatio: "1 / 1", background: "#f6f6f7" }}
                  >
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : null}
                    {p.discount > 0 && (
                      <span
                        className="position-absolute badge bg-danger"
                        style={{ top: 8, left: 8 }}
                      >
                        {p.discount}% off
                      </span>
                    )}
                    {!p.inStock && (
                      <span
                        className="position-absolute badge bg-secondary"
                        style={{ bottom: 8, left: 8 }}
                      >
                        Out of stock
                      </span>
                    )}
                  </div>
                  <p className="mb-1 fw-medium text-truncate" title={p.title}>
                    {p.title}
                  </p>
                  <p className="mb-0">
                    <span className="fw-semibold">{rupees(p.price)}</span>
                    {p.originalPrice > p.price && (
                      <span className="text-muted ms-2 text-decoration-line-through" style={{ fontSize: 13 }}>
                        {rupees(p.originalPrice)}
                      </span>
                    )}
                  </p>
                  {p.rating && (
                    <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                      ★ {p.rating.average} ({p.rating.count})
                    </p>
                  )}
                </a>
              </div>
            ))}
          </div>

          {total > products.length && (
            <div className="text-center mt-3">
              <a href={shopUrl} target="_blank" rel="noreferrer" data-testid="vendor-store-all">
                See all {total} products
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
