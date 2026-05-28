import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Pathnames that should be treated as "same view" — switching between them
// shouldn't trigger a scroll-to-top (e.g. honeymoon hero tab variants).
const isHoneymoonHeroVariant = (path) =>
    path === "/honeymoon" || /^\/honeymoon\/search(\/.*)?$/.test(path);

const isSameViewNavigation = (prev, next) =>
    isHoneymoonHeroVariant(prev) && isHoneymoonHeroVariant(next);

export default function ScrollToTop() {
    const { pathname, search } = useLocation();
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        // iOS Safari fix – prevent it restoring old scroll
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const prevPath = prevPathRef.current;
        prevPathRef.current = pathname;

        // Skip scroll when only the in-page tab segment changed.
        if (isSameViewNavigation(prevPath, pathname)) {
            return;
        }

        // Automatic scroll to top AFTER route change
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto", // IMPORTANT for iPhone
            });
        }, 0);
    }, [pathname, search]);

    return null;
}
