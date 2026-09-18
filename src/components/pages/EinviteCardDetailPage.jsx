import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SEO from "../common/SEO";
import LoginPopup from "./designStudio/DesignStudio.LoginPopup";
import { einviteApi } from "../../services/api/einviteApi";
import EinvitePage from "../layouts/einvites/design/EinvitePage";
import EinviteTemplateTile from "../layouts/einvites/EinviteTemplateTile";
import {
  CARD_TYPES,
  cardFonts,
  cardSetSummary,
  getCardPages,
  isVideoCard,
  loadFonts,
  pageTitle,
} from "../layouts/einvites/design/einviteDesign";
import EinviteVideoPlayer from "../layouts/einvites/design/EinviteVideoPlayer";
import "../layouts/einvites/einviteStudio.css";

const EinviteCardDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = Boolean(user && isAuthenticated);

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    einviteApi
      .getCard(slug)
      .then((data) => {
        if (cancelled) return;
        if (data && data.isTemplate === false) {
          // A couple's own invitation has its own guest view.
          navigate(`/einvites/view/${data.id}`, { replace: true });
          return;
        }
        setCard(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "This design could not be found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  const pages = useMemo(() => getCardPages(card), [card]);
  const typeInfo = CARD_TYPES.find((type) => type.value === card?.cardType) || CARD_TYPES[0];

  // Load every page's fonts up front so switching pages never flashes a fallback.
  useEffect(() => {
    if (pages.length) loadFonts(cardFonts(pages));
  }, [pages]);

  useEffect(() => {
    if (!card) return;
    einviteApi
      .getTemplates({ cardType: card.cardType, limit: 5 })
      .then((result) => setRelated((result?.data || []).filter((c) => c.id !== card.id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [card]);

  const requestedPage = parseInt(searchParams.get("page"), 10) || 1;
  const pageIndex = Math.min(Math.max(requestedPage, 1), Math.max(pages.length, 1)) - 1;

  const goToPage = (index) => {
    const next = new URLSearchParams(searchParams);
    if (index > 0) next.set("page", String(index + 1));
    else next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const openEditor = () => navigate(`/einvites/editor/${card.id}`);

  const customise = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    openEditor();
  };

  if (loading) {
    return (
      <div className="eiv">
        <div className="container py-5 text-center">
          <div className="spinner-border" style={{ color: "#ed1173" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="eiv">
        <div className="eiv-empty">
          <h3>Design not found</h3>
          <p>{error || "This invitation design is no longer available."}</p>
          <Link to="/einvites/category/wedding_einvite" className="eiv-outline-btn">
            Browse all designs
          </Link>
        </div>
      </div>
    );
  }

  const isVideo = isVideoCard(card);

  const cta = (
    <button type="button" className="eiv-primary-btn" onClick={customise}>
      {isVideo ? "Customise the video" : "Customise the card"}
    </button>
  );

  return (
    <div className="eiv">
      <SEO
        title={`${card.name} – ${typeInfo.title} | HappyWedz`}
        description={`Personalise the ${card.name} ${typeInfo.title.toLowerCase().replace(/s$/, "")} with your names, dates and venue. ${pages.length} beautifully designed ${pages.length === 1 ? "card" : "cards"}.`}
      />

      <div className="container py-4">
        <nav className="eiv-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/einvites">Invitation Cards</Link>
          <span>›</span>
          <Link to={`/einvites/category/${typeInfo.value}`}>{typeInfo.title}</Link>
          <span>›</span>
          <span>{card.name}</span>
        </nav>

        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-7">
            <h1 className="eiv-card-title">{card.name}</h1>

            {isVideo ? (
              <div className="eiv-video-stage">
                <EinviteVideoPlayer video={card.video} pages={pages} />
              </div>
            ) : (
            <>
            {pages.length > 1 && (
              <div className="eiv-page-pills" role="tablist" aria-label="Cards in this set">
                {pages.map((page, index) => (
                  <button
                    key={page.id}
                    type="button"
                    role="tab"
                    aria-selected={index === pageIndex}
                    className={`eiv-page-pill ${index === pageIndex ? "is-active" : ""}`}
                    onClick={() => goToPage(index)}
                  >
                    {pageTitle(page, index)}
                  </button>
                ))}
              </div>
            )}

            <div className="eiv-stage">
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Previous card"
                  disabled={pageIndex === 0} onClick={() => goToPage(pageIndex - 1)}>
                  <FiChevronLeft size={22} />
                </button>
              )}
              <div className="eiv-stage-card">
                <EinvitePage page={pages[pageIndex]} />
              </div>
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Next card"
                  disabled={pageIndex === pages.length - 1} onClick={() => goToPage(pageIndex + 1)}>
                  <FiChevronRight size={22} />
                </button>
              )}
            </div>

            {pages.length > 1 && (
              <div className="eiv-thumbs">
                {pages.map((page, index) => (
                  <button key={page.id} type="button" aria-label={`Show ${pageTitle(page, index)}`}
                    className={`eiv-thumb ${index === pageIndex ? "is-active" : ""}`}
                    onClick={() => goToPage(index)}>
                    <EinvitePage page={page} />
                  </button>
                ))}
              </div>
            )}
            </>
            )}
          </div>

          <div className="col-lg-5">
            <div className="eiv-info">
              <span className="eiv-eyebrow">{typeInfo.title}</span>
              <h2 className="eiv-info-title mt-2 mb-3">{card.name}</h2>
              <div className="d-flex flex-wrap gap-2">
                <span className="eiv-chip">
                  {isVideo ? "10-second video" : `${pages.length} ${pages.length === 1 ? "card" : "cards"}`}
                </span>
                {card.culture && <span className="eiv-chip">{card.culture}</span>}
                {card.theme && <span className="eiv-chip">{card.theme}</span>}
              </div>
              {!isVideo && pages.length > 1 && cardSetSummary(pages) && (
                <p className="eiv-status mt-3 mb-0">
                  <strong>Includes:</strong> {cardSetSummary(pages)}
                </p>
              )}
              {isVideo ? (
              <ul className="eiv-points">
                <li><FiCheck size={16} /> Add your names, date and venue to each scene</li>
                <li><FiCheck size={16} /> Get a 10-second HD video (MP4) with music</li>
                <li><FiCheck size={16} /> Send it on WhatsApp or share a link and collect RSVPs</li>
              </ul>
              ) : (
              <ul className="eiv-points">
                <li><FiCheck size={16} /> Add your names, dates and venue on every card</li>
                <li><FiCheck size={16} /> Elegant wedding fonts, already laid out for you</li>
                <li><FiCheck size={16} /> Keep only the functions you need, and choose which guests see which cards</li>
                <li><FiCheck size={16} /> Share one link, collect RSVPs, or download in HD</li>
              </ul>
              )}
              <div className="d-none d-lg-block">{cta}</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-5 pt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="eiv-section-title mb-0">More {typeInfo.title}</h2>
              <Link to={`/einvites/category/${typeInfo.value}`} className="eiv-link-btn">View all</Link>
            </div>
            <div className="eiv-grid">
              {related.map((item) => (
                <EinviteTemplateTile key={item.id} card={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="eiv-sticky-cta d-lg-none">{cta}</div>

      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          setShowLogin(false);
          openEditor();
        }}
      />
    </div>
  );
};

export default EinviteCardDetailPage;
