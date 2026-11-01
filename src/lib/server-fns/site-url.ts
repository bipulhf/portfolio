import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

export const getSiteOriginFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    return getRequestUrl({
      xForwardedHost: true,
      xForwardedProto: true,
    }).origin;
  } catch {
    return process.env.SITE_URL || "http://localhost:3000";
  }
});

export function resolveSiteOrigin(): Promise<string> | string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return getSiteOriginFn();
}
