import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export default function SmoothScroll() {
  const { pathname, search } = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Prevent iOS Safari from restoring old scroll positions natively
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Instantiate Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1.0,
      smoothTouch: false, // Maintain native touch scroll feel on mobile/touch devices
      touchMultiplier: 2.0,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis to global window for accessibility and debugging
    window.lenis = lenis;

    // Animation frame loop
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Recalculating Lenis' dimensions forces a synchronous reflow, so it must be
    // both rate-limited AND driven by a signal that cannot re-trigger itself.
    //
    // Two approaches were tried here and BOTH regressed; recorded so they are not
    // retried:
    //   1. MutationObserver calling lenis.resize() directly on every mutation.
    //      React inserts hundreds of nodes during the initial render, so this
    //      forced hundreds of reflows — 344 ms of forced reflow.
    //   2. ResizeObserver on document.body. lenis.resize() WRITES layout, which
    //      changes the body box, which re-triggers the observer: a permanent
    //      once-per-frame reflow loop. Far worse — a single 2,883 ms long task
    //      and 3,030 ms Total Blocking Time.
    //
    // MutationObserver does not react to layout writes, so it cannot feed back.
    // The rAF gate collapses a mutation storm into one check per frame, and the
    // height comparison skips the reflow entirely when nothing actually moved.
    let lastHeight = 0;
    let resizeScheduled = false;
    const scheduleResize = () => {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeScheduled = false;
        const height = document.documentElement.scrollHeight;
        if (height === lastHeight) return;
        lastHeight = height;
        lenis.resize();
      });
    };

    window.addEventListener("resize", scheduleResize);

    const observer = new MutationObserver(scheduleResize);
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleResize);
      observer.disconnect();
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Instantly scroll to the top of the page when navigating to a new route/search
  useEffect(() => {
    if (lenisRef.current) {
      // Small timeout ensures react-router-dom finishes rendering the new page
      setTimeout(() => {
        lenisRef.current.scrollTo(0, { immediate: true });
      }, 0);
    }
  }, [pathname, search]);

  return null;
}
