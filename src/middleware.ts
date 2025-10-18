import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/; // Files

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  // Clone the URL
  const url = req.nextUrl.clone();
  const host = (req.headers.get("host") as string) || "";
  if (url.pathname.includes("_next") || url.pathname.includes("static")) return;
  if (
    !url.pathname.startsWith("/.well-known/atproto-did") &&
    host.includes(".cat")
  ) {
    url.pathname = "/cat";
    return NextResponse.rewrite(url);
  }

  if (!url.pathname.startsWith("/.well-known/atproto-did")) return;

  const fileDomains = process.env.DOMAINS_FILE_VERIFICATION?.split(",");

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
