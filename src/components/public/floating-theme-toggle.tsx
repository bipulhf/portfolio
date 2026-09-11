import { PUBLIC_THEME_OPTIONS } from "~/lib/public-theme";
import { prefetchStudioScene } from "~/components/public/prefetch-studio";
import { useEffect, useState, useRef } from "react";
import { usePublicTheme } from "~/components/public/public-theme";
import { cx } from "~/components/portfolio/lib/styles";
import { rafThrottle } from "~/lib/raf-throttle";

const THEME_SWITCH_DURATION_MS = 420;

const options = PUBLIC_THEME_OPTIONS;

export function FloatingThemeToggle() {
  const { setTheme, theme } = usePublicTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const lastScrollY = useRef(0);
  const switchResetTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const currentScrollY = window.scrollY;
      let nextVisible = true;

      // Only apply hide/show logic on mobile
      if (window.innerWidth < 768) {
        nextVisible = !(
          currentScrollY > lastScrollY.current && currentScrollY > 100
        );
      }

      lastScrollY.current = currentScrollY;
      setIsVisible((current) => (current === nextVisible ? current : nextVisible));
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (switchResetTimeout.current !== null) {
        window.clearTimeout(switchResetTimeout.current);
      }
    };
  }, []);

  const handleThemeChange = (nextTheme: (typeof options)[number]["value"]) => {
    if (nextTheme === theme) {
      return;
    }

    if (switchResetTimeout.current !== null) {
      window.clearTimeout(switchResetTimeout.current);
    }

    setIsSwitching(true);
    setTheme(nextTheme);
    switchResetTimeout.current = window.setTimeout(() => {
      setIsSwitching(false);
      switchResetTimeout.current = null;
    }, THEME_SWITCH_DURATION_MS);
  };

  return (
    <div
      className={cx(
        "public-theme-toggle-rail transition-all duration-500 ease-in-out",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 md:translate-y-0 md:opacity-100",
      )}
    >
      <div className="public-theme-toggle-dock">
        <div
          aria-label="Switch portfolio theme"
          className={cx("public-theme-toggle", isSwitching && "is-switching")}
          role="group"
        >
          {options.map((option) => {
            const active = theme === option.value;

            return (
              <button
                aria-pressed={active}
                className={cx(
                  "public-theme-toggle__button cursor-pointer",
                  active && "is-active",
                )}
                key={option.value}
                onClick={() => handleThemeChange(option.value)}
                onFocus={
                  option.value === "studio" ? prefetchStudioScene : undefined
                }
                onPointerEnter={
                  option.value === "studio" ? prefetchStudioScene : undefined
                }
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
