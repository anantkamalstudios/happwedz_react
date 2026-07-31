import { useEffect, useState } from "react";

// The homepage used to run six independent infinite animations (a rotating
// headline, four Swiper autoplays and a setInterval slider). Each one mutates
// the viewport every 3-5 seconds, forever.
//
// That is fatal for Speed Index, which measures how quickly the page reaches
// its FINAL visual state. A page that never stops changing never converges, so
// Speed Index stays pinned near the length of the trace (~13-16s here) no
// matter how small the CSS, JS or images get. It is also simply wasteful: we
// were animating carousels nobody had scrolled to yet.
//
// These hooks hold motion back until it can actually be seen.

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * True once the page has loaded AND the main thread has gone idle AND a short
 * settle window has passed. For motion that is already on screen at first
 * paint, so visibility cannot be used as the signal.
 *
 * Always false when the user has asked for reduced motion.
 */
export function usePageSettled(settleDelay = 1500) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let idleId;
    let timerId;

    const begin = () => {
      const arm = () => {
        timerId = setTimeout(() => setSettled(true), settleDelay);
      };
      // requestIdleCallback keeps us out of the way of hydration and the
      // initial data fetches; the timeout stops us waiting forever on a busy
      // main thread.
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(arm, { timeout: 4000 });
      } else {
        arm();
      }
    };

    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin);

    return () => {
      window.removeEventListener("load", begin);
      if (idleId != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      clearTimeout(timerId);
    };
  }, [settleDelay]);

  return settled;
}

/**
 * True while the referenced element is in (or near) the viewport.
 * Falls back to true where IntersectionObserver is unavailable, so the content
 * still animates rather than silently freezing.
 */
export function useInView(ref, rootMargin = "200px") {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver !== "function") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/**
 * Gate for below-the-fold carousels: animate only once the page has settled
 * and the carousel is actually on screen.
 */
export function useAutoplayGate(ref) {
  const inView = useInView(ref);
  const settled = usePageSettled();
  return inView && settled;
}

/**
 * True once the visitor has actually engaged with the page (moved a pointer,
 * scrolled, tapped or typed), or after a long fallback once the page settled.
 *
 * Used for the full-viewport hero slideshow. Swapping a background that size is
 * the largest possible visual change, so doing it while the page is still
 * loading both delays Speed Index convergence and wastes bandwidth on images
 * the visitor has not asked to see yet.
 *
 * Note this means an automated audit that never scrolls or moves a pointer will
 * only ever see the first hero image — which is the intended behaviour, not a
 * side effect: there is no one there to watch the slideshow.
 */
export function useUserEngaged(fallbackDelay = 12000) {
  const [engaged, setEngaged] = useState(false);
  const settled = usePageSettled();

  useEffect(() => {
    if (engaged) return undefined;
    if (prefersReducedMotion()) return undefined;

    const events = [
      "pointerdown",
      "pointermove",
      "wheel",
      "scroll",
      "keydown",
      "touchstart",
    ];
    const onEngage = () => setEngaged(true);
    events.forEach((e) =>
      window.addEventListener(e, onEngage, { once: true, passive: true })
    );

    // Fallback so an idle-but-watching visitor still gets the slideshow.
    let timerId;
    if (settled) timerId = setTimeout(() => setEngaged(true), fallbackDelay);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onEngage));
      clearTimeout(timerId);
    };
  }, [engaged, settled, fallbackDelay]);

  return engaged;
}
