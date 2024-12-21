export enum DomainType {
  CLOUDFLARE = "cloudflare",
  FILE = "file",
}

const fileDomains =
  process.env.NEXT_PUBLIC_DOMAINS_FILE_VERIFICATION?.split(",");
const cloudflareDomains =
  process.env.NEXT_PUBLIC_DOMAINS_CLOUDFLARE?.split(",");

export const domains: { [domain: string]: DomainType } = {};

fileDomains?.forEach((domain) => {
  domains[domain] = DomainType.FILE;
});

cloudflareDomains?.forEach((domain) => {
  domains[domain] = DomainType.CLOUDFLARE;
});
