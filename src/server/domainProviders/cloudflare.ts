import { env } from "process";

const cloudflareProvider = {
  createSubdomain: async (
    domainName: string,
    domainValue: string,
    zoneName: string,
    type: string
  ) => {
    const zones = env.DOMAINS_CLOUDFLARE?.split(",");
    const zoneId = zones?.find((el) => el.startsWith(zoneName))?.split(":")[1];

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId || ""}/dns_records`,
      {
        body: JSON.stringify({
          name: domainName,
          type,
          content: domainValue,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.CLOUDFLARE_SECRET || ""}`,
        },
        method: "POST",
      }
    );

    type CloudflareResponse = {
      success?: boolean;
    };
    const { success } = (await response.json()) as CloudflareResponse;
    return response.status === 200 && success;
  },
};

export default cloudflareProvider;
