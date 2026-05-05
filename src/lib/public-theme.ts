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

