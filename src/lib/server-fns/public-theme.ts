import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import {
  DEFAULT_PUBLIC_THEME,
  isPublicTheme,
  PUBLIC_THEME_COOKIE_KEY,
} from "~/lib/public-theme";

export const getInitialPublicThemeFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const theme = getCookie(PUBLIC_THEME_COOKIE_KEY);
  return isPublicTheme(theme) ? theme : DEFAULT_PUBLIC_THEME;
});
