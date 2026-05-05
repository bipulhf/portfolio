import { useEffect, useState, useRef } from "react";
import { usePublicTheme } from "~/components/public/public-theme";
import { cx } from "~/components/portfolio/lib/styles";

const THEME_SWITCH_DURATION_MS = 420;

const options = [
  { label: "Crayon", value: "crayon" },
  { label: "Minimal", value: "minimal" },
] as const;

export function FloatingThemeToggle() {
  const { setTheme, theme } = usePublicTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);
  const lastScrollY = useRef(0);
  const switchResetTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only apply hide/show logic on mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        // Always visible on desktop
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
          <span
            aria-hidden="true"
            className={cx(
              "public-theme-toggle__thumb",
              theme === "minimal" && "is-minimal",
            )}
          />
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
