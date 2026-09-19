import React, { useCallback, useEffect, useRef, useState } from "react";
import EinvitePage from "./EinvitePage";
import { VIDEO_ASPECT, VIDEO_DURATION, fieldStateAt } from "./einviteDesign";

const layer = { position: "absolute", inset: 0, width: "100%", height: "100%" };

// CSS for a text box's animation state (see entranceState in einviteDesign).
const motionStyle = (state, scale) =>
  state
    ? {
        opacity: state.opacity,
        transform: `translateY(${state.dy * scale}px) scale(${state.scale})`,
        transformOrigin: "center",
        clipPath: state.reveal < 1 ? `inset(-50% ${(1 - state.reveal) * 100}% -50% 0)` : undefined,
      }
    : null;

// A still frame of a video at a given time, used behind the text while a
// scene is being designed.
export const VideoFrame = ({ src, time = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    const seek = () => {
      const length = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null;
      video.currentTime = length ? time % length : time;
    };
    if (video.readyState >= 1) seek();
    video.addEventListener("loadedmetadata", seek);
    return () => video.removeEventListener("loadedmetadata", seek);
  }, [src, time]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="auto"
      style={{ ...layer, objectFit: "cover", pointerEvents: "none" }}
    />
  );
};

// Plays a video invitation the way the rendered MP4 looks: the background
// loops, the music (if any) plays alongside, and each text box enters with its
// animation and fades out with its scene.
const EinviteVideoPlayer = ({ video, pages, autoPlay = true, showControls = true, className = "", style }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const clockRef = useRef({ startedAt: 0, offset: 0 });
  const frameRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);

  const duration = video?.duration || VIDEO_DURATION;
  const hasMusic = Boolean(video?.audioUrl);

  const tick = useCallback(() => {
    const clock = clockRef.current;
    let t = clock.offset + (performance.now() - clock.startedAt) / 1000;
    if (t >= duration) {
      // Start the whole invitation again, background and music included.
      clock.offset = 0;
      clock.startedAt = performance.now();
      t = 0;
      if (videoRef.current) videoRef.current.currentTime = 0;
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
    setTime(t);
    frameRef.current = requestAnimationFrame(tick);
  }, [duration]);

  const play = useCallback(() => {
    clockRef.current.startedAt = performance.now();
    videoRef.current?.play().catch(() => {});
    if (audioRef.current) audioRef.current.play().catch(() => {});
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
    setPlaying(true);
  }, [tick]);

  const pause = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const clock = clockRef.current;
    clock.offset = Math.min(duration, clock.offset + (performance.now() - clock.startedAt) / 1000);
    videoRef.current?.pause();
    audioRef.current?.pause();
    setPlaying(false);
  }, [duration]);

  // React doesn't reliably update the muted property after the first render.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = hasMusic || muted;
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted, hasMusic]);

  useEffect(() => {
    // Browsers only autoplay muted media, so the invitation starts silent.
    if (autoPlay) play();
    return () => cancelAnimationFrame(frameRef.current);
  }, [autoPlay, play]);

  const toggleSound = (event) => {
    event.stopPropagation();
    const next = !muted;
    setMuted(next);
    if (!next && !playing) play();
  };

  const visible = (pages || []).filter((page) => time >= page.start && time < page.end);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `1 / ${VIDEO_ASPECT}`,
        overflow: "hidden",
        background: "#111",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
      onClick={() => (playing ? pause() : play())}
      role="button"
      aria-label={playing ? "Pause the video" : "Play the video"}
    >
      <video
        ref={videoRef}
        src={video?.videoUrl}
        poster={pages?.[0]?.backgroundUrl || undefined}
        muted={hasMusic || muted}
        loop
        playsInline
        preload="auto"
        style={{ ...layer, objectFit: "cover" }}
      />
      {hasMusic && <audio ref={audioRef} src={video.audioUrl} muted={muted} loop preload="auto" />}

      {visible.map((page) => (
        <EinvitePage
          key={page.id}
          page={{ ...page, backgroundUrl: "" }}
          style={{ ...layer, background: "transparent" }}
          fieldStyle={(field, scale) => motionStyle(fieldStateAt(page, field, time), scale)}
        />
      ))}

      {showControls && (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.55))",
          color: "#fff",
        }}
      >
        <span style={{ fontSize: 18, width: 18, textAlign: "center" }} aria-hidden="true">
          {playing ? "❚❚" : "►"}
        </span>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: `${(time / duration) * 100}%`, height: "100%", borderRadius: 2, background: "#fff" }} />
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          style={{
            border: 0,
            borderRadius: 999,
            padding: "3px 10px",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: 12,
          }}
        >
          {muted ? "🔇 Sound off" : "🔊 Sound on"}
        </button>
      </div>
      )}
    </div>
  );
};

export default EinviteVideoPlayer;
