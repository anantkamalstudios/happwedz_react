import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiDownload, FiEdit2, FiExternalLink } from "react-icons/fi";
import { einviteApi } from "../../services/api/einviteApi";
import EinvitePage from "../layouts/einvites/design/EinvitePage";
import {
  cardFonts,
  cardPath,
  getCardPages,
  isVideoCard,
  loadFonts,
  pageTitle,
} from "../layouts/einvites/design/einviteDesign";
import { downloadCardPages } from "../layouts/einvites/design/exportCard";
import EinviteVideoPlayer from "../layouts/einvites/design/EinviteVideoPlayer";
import VideoRenderPanel from "../layouts/einvites/share/VideoRenderPanel";
import ShareLinksTab from "../layouts/einvites/share/ShareLinksTab";
import SendToGuestsTab from "../layouts/einvites/share/SendToGuestsTab";
import RsvpTab from "../layouts/einvites/share/RsvpTab";
import { cardViewUrl } from "../layouts/einvites/share/shareUtils";
import "../layouts/einvites/einviteStudio.css";

const TABS = [
  { value: "links", label: "Share links" },
  { value: "guests", label: "Send to guests" },
  { value: "rsvps", label: "RSVPs" },
];

// The couple's sharing hub: links for guest groups, personal invitations from
// the guest list, and the replies. Anyone else is sent to the guest view.
const EinviteSharePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.id || authUser?._id || authUser?.userId;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(null);

  const tab = TABS.some((item) => item.value === searchParams.get("tab")) ? searchParams.get("tab") : "links";
  const setTab = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "links") next.delete("tab");
    else next.set("tab", value);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    einviteApi
      .getCard(id)
      .then((data) => {
        if (cancelled) return;
        if (data?.isTemplate) {
          navigate(cardPath(data), { replace: true });
          return;
        }
        const isOwner = currentUserId && data?.ownerUserId && String(data.ownerUserId) === String(currentUserId);
        if (!isOwner) {
          navigate(`/einvites/view/${id}`, { replace: true });
          return;
        }
        setCard(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load the invitation.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigate, currentUserId]);

  const pages = useMemo(() => getCardPages(card), [card]);
  useEffect(() => {
    if (pages.length) loadFonts(cardFonts(pages));
  }, [pages]);

  const downloadAll = async () => {
    setDownloading(true);
    try {
      await downloadCardPages(card.name, pages);
    } catch (err) {
      console.error("Error downloading invitation:", err);
      Swal.fire({ text: "Couldn't create the images. Please try again.", icon: "error" });
    } finally {
      setDownloading(false);
    }
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

  if (error || !card || pages.length === 0) {
    return (
      <div className="eiv">
        <div className="eiv-empty">
          <h3>Invitation not found</h3>
          <p>{error || "The requested invitation could not be found."}</p>
          <Link className="eiv-outline-btn" to="/einvites/my-cards">
            <FiArrowLeft /> Your Cards
          </Link>
        </div>
      </div>
    );
  }

  const page = pages[Math.min(pageIndex, pages.length - 1)];
  // A video is shared as one piece: links and RSVPs don't pick between its scenes.
  const isVideo = isVideoCard(card);
  const sharePages = isVideo ? pages.slice(0, 1) : pages;

  return (
    <div className="eiv">
      <div className="container py-4">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
          <Link to="/einvites/my-cards" className="eiv-outline-btn">
            <FiArrowLeft /> Your Cards
          </Link>
          <div className="d-flex flex-wrap gap-2 ms-auto">
            <a className="eiv-outline-btn" href={cardViewUrl(card.id)} target="_blank" rel="noopener noreferrer">
              <FiExternalLink /> Guest view
            </a>
            <Link className="eiv-outline-btn" to={`/einvites/editor/${card.id}`}>
              <FiEdit2 /> Edit
            </Link>
            {!isVideo && (
              <button type="button" className="eiv-outline-btn" onClick={downloadAll} disabled={downloading}>
                <FiDownload /> {downloading ? "Preparing..." : "Download"}
              </button>
            )}
          </div>
        </div>

        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-4">
            <h1 className="eiv-info-title mb-1">{card.name}</h1>
            <p className="eiv-status mb-3">
              {isVideo
                ? `${card.video?.duration || 10}-second video invitation`
                : `${pages.length} ${pages.length === 1 ? "card" : "cards"}${pages.length > 1 ? ` · ${pageTitle(page, pageIndex)}` : ""}`}
            </p>
            {isVideo ? (
              <>
                <div className="eiv-video-stage">
                  <EinviteVideoPlayer video={card.video} pages={pages} />
                </div>
                <VideoRenderPanel
                  card={card}
                  pages={pages}
                  autoStart={searchParams.get("create") === "1"}
                  onUnlocked={() => setCard((prev) => ({ ...prev, isUnlocked: true }))}
                />
              </>
            ) : (
            <div className="eiv-stage">
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Previous card"
                  disabled={pageIndex === 0} onClick={() => setPageIndex(pageIndex - 1)}>
                  <FiChevronLeft size={22} />
                </button>
              )}
              <div className="eiv-stage-card">
                <EinvitePage page={page} />
              </div>
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Next card"
                  disabled={pageIndex === pages.length - 1} onClick={() => setPageIndex(pageIndex + 1)}>
                  <FiChevronRight size={22} />
                </button>
              )}
            </div>
            )}
          </div>

          <div className="col-lg-8">
            <div className="eiv-info">
              {isVideo && card.isUnlocked === false ? (
                <div className="eiv-empty py-4">
                  <h3>Pay to share your video</h3>
                  <p>This is a paid design. Once you've paid, you can create the video and share it with guests here.</p>
                </div>
              ) : (
              <>
              <div className="eiv-share-tabs" role="tablist">
                {TABS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    role="tab"
                    aria-selected={tab === item.value}
                    className={tab === item.value ? "is-active" : ""}
                    onClick={() => setTab(item.value)}
                  >
                    {item.label}
                    {item.value === "rsvps" && rsvpCount > 0 && <span className="eiv-tab-count">{rsvpCount}</span>}
                  </button>
                ))}
              </div>

              {tab === "links" && <ShareLinksTab card={card} pages={sharePages} />}
              {tab === "guests" && <SendToGuestsTab card={card} pages={sharePages} userId={currentUserId} />}
              {tab === "rsvps" && <RsvpTab card={card} pages={sharePages} onCount={setRsvpCount} />}
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EinviteSharePage;
