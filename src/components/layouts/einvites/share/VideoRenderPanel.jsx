import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { FiDownload, FiFilm, FiRefreshCw, FiShare2 } from "react-icons/fi";
import { einviteApi } from "../../../../services/api/einviteApi";
import { renderVideoOverlays } from "../design/exportCard";

const POLL_MS = 2000;

const fileName = (name) =>
  `${String(name || "invitation").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "invitation"}.mp4`;

const fetchVideoFile = async (url, name) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Couldn't fetch the video");
  const blob = await response.blob();
  return new File([blob], fileName(name), { type: "video/mp4" });
};

// Makes the couple's MP4 on the server and offers it for download or sharing.
const VideoRenderPanel = ({ card, pages }) => {
  const [state, setState] = useState(() => ({
    status: card.videoRender?.status || "none",
    url: card.videoRender?.url || null,
    isCurrent: Boolean(card.videoRender?.isCurrent),
    error: card.videoRender?.error || null,
  }));
  const [preparing, setPreparing] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);

  const working = preparing || state.status === "queued" || state.status === "rendering";

  const poll = useCallback(async () => {
    try {
      const next = await einviteApi.getVideoRender(card.id);
      setState((prev) => ({ ...prev, ...next }));
      if (next?.status === "queued" || next?.status === "rendering") {
        timerRef.current = setTimeout(poll, POLL_MS);
      }
    } catch {
      timerRef.current = setTimeout(poll, POLL_MS * 2);
    }
  }, [card.id]);

  // Pick up a render already running (e.g. after a page refresh).
  useEffect(() => {
    poll();
    return () => clearTimeout(timerRef.current);
  }, [poll]);

  const create = async () => {
    setPreparing(true);
    try {
      const overlays = await renderVideoOverlays(pages);
      const next = await einviteApi.startVideoRender(card.id, overlays);
      setState((prev) => ({ ...prev, ...next, error: null }));
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(poll, POLL_MS);
    } catch (err) {
      Swal.fire({ text: err.message || "Couldn't start creating the video.", icon: "error" });
    } finally {
      setPreparing(false);
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      const file = await fetchVideoFile(state.url, card.name);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch {
      window.open(state.url, "_blank", "noopener");
    } finally {
      setBusy(false);
    }
  };

  // Phones can hand the MP4 itself to WhatsApp and other apps.
  const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";
  const share = async () => {
    setBusy(true);
    try {
      const file = await fetchVideoFile(state.url, card.name);
      if (!navigator.canShare({ files: [file] })) throw new Error("unsupported");
      await navigator.share({ files: [file], title: card.name });
    } catch (err) {
      if (err?.name !== "AbortError") {
        Swal.fire({ text: "Sharing the file isn't supported here. Download the video and send it from your phone.", icon: "info" });
      }
    } finally {
      setBusy(false);
    }
  };

  const hasVideo = state.status === "done" || Boolean(state.url);

  return (
    <div className="eiv-video-panel">
      <div className="d-flex align-items-center gap-2 mb-1">
        <FiFilm size={18} />
        <strong>Video file (MP4)</strong>
      </div>

      {working ? (
        <>
          <p className="eiv-status mb-2">
            {preparing
              ? "Preparing your text..."
              : state.status === "queued" && state.position > 1
              ? `Waiting to start (${state.position - 1} ahead of you)...`
              : "Creating your video. This takes about 10–20 seconds..."}
          </p>
          <div className="eiv-progress"><div /></div>
        </>
      ) : (
        <>
          {state.status === "failed" && <p className="eiv-video-error">{state.error || "We couldn't create your video."}</p>}
          {hasVideo && state.isCurrent && <p className="eiv-status mb-2">Your video is ready.</p>}
          {hasVideo && !state.isCurrent && state.status !== "failed" && (
            <p className="eiv-status mb-2">You've changed the text since this video was made. Create it again to update it.</p>
          )}
          {!hasVideo && state.status !== "failed" && (
            <p className="eiv-status mb-2">Create a 10-second MP4 to download or send on WhatsApp.</p>
          )}

          <div className="d-flex flex-wrap gap-2">
            {(!hasVideo || !state.isCurrent || state.status === "failed") && (
              <button type="button" className="eiv-primary-btn eiv-btn-sm" onClick={create}>
                {hasVideo || state.status === "failed" ? <FiRefreshCw size={16} /> : <FiFilm size={16} />}
                {hasVideo ? "Create again" : state.status === "failed" ? "Try again" : "Create video"}
              </button>
            )}
            {hasVideo && state.url && (
              <>
                <button type="button" className="eiv-outline-btn" onClick={download} disabled={busy}>
                  <FiDownload size={16} /> Download
                </button>
                {canShareFiles && (
                  <button type="button" className="eiv-outline-btn" onClick={share} disabled={busy}>
                    <FiShare2 size={16} /> Share video
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoRenderPanel;
