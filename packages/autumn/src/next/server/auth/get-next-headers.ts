export async function getNextHeadersAndCookies() {
  try {
    // @ts-ignore
    let headerModule = await import("next/headers");
    return {
      headers: headerModule.headers,
      cookies: headerModule.cookies,
    };
  } catch (e) {
    throw {
      message:
        "Failed to import next/headers. Please ensure Next.js is installed correctly.",
      code: "failed_to_import_next_headers",
    };
  }
}
