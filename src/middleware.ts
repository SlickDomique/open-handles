import { env } from "process";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();

  if (!url.pathname.startsWith("/.well-known/atproto-did")) return;
  // Skip public files
  //   if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes("_next")) return;

  const host = req.headers.get("host") || "";

  const fileDomains = env.DOMAINS_FILE_VERIFICATION?.split(",");

  try {
    const hostUrl = new URL(`https://${host}`).hostname;
    const hostName = fileDomains?.find((el) => hostUrl.endsWith(el));
    if (!hostName) return;

    const subdomain = hostUrl.replace(`.${hostName}`, "");
    const mainDomain = hostUrl.replace(`${subdomain}.`, "");
    url.pathname = `/api/file-verification/${mainDomain}/${subdomain}`;

    return NextResponse.rewrite(url);
  } catch (e) {
    console.error(e);
    return;
  }
}
