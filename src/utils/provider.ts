import { env } from "process";

export const getProvider = (domain: string) => {
  const cloudflareVerifiedDomains = env.DOMAINS_CLOUDFLARE?.split(",");
  const fileVerifiedDomains = env.DOMAINS_FILE_VERIFICATION?.split(",");

  if (cloudflareVerifiedDomains?.find((el) => el.split(":")[0] === domain)) {
    return "cloudflare";
  } else if (fileVerifiedDomains?.find((el) => el === domain)) {
    return "file";
  }

  return null;
};
