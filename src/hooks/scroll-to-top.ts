import { useEffect } from "react";
import { useLocation } from "react-router";

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const sectionId = params.get("section");

    if (sectionId) {
      // Retry briefly to handle lazy-loaded route content before scrolling.
      let attempts = 0;
      const maxAttempts = 20;

      const tryScrollToSection = () => {
        const target = document.getElementById(sectionId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }

        if (attempts < maxAttempts) {
          attempts += 1;
          requestAnimationFrame(tryScrollToSection);
        }
      };

      tryScrollToSection();
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
