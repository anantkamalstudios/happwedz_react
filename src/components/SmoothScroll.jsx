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

    // Update Lenis dimensions on window resize
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", handleResize);

    // Watch for dynamic DOM changes (like images loading, lazy routes rendering) to recalculate page height
    const observer = new MutationObserver(() => {
      lenis.resize();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
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
