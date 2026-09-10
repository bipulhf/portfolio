export type PublicTheme = "crayon" | "minimal";

export const DEFAULT_PUBLIC_THEME: PublicTheme = "crayon";
export const PUBLIC_THEME_STORAGE_KEY = "portfolio-public-theme";
export const PUBLIC_THEME_COOKIE_KEY = "portfolio-public-theme";
export const PUBLIC_THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isPublicTheme(
  value: string | null | undefined,
): value is PublicTheme {
  return value === "crayon" || value === "minimal";
}

export function themeOnlyClass(theme: PublicTheme) {
  return theme === "crayon" ? "theme-only-crayon" : "theme-only-minimal";
}

// Each theme uses its own type families, so only the active one belongs in the
// critical path. The other sheet is added by the client when the theme flips.
export const PUBLIC_THEME_FONT_STYLESHEETS: Record<PublicTheme, string> = {
  crayon:
    "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Nunito:wght@400;600;700;800&display=swap",
  minimal:
    "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&f[]=satoshi@400,500,700,900&display=swap",
};
