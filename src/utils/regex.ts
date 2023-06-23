import { env } from "process";

const regex = {
  getDomainNameRegex: () =>
    new RegExp(
      `^(${
        env.DOMAINS_CLOUDFLARE?.split(",")
          .map((val) => val.split(":")[0])
          .join("|") || ""
      })$`
    ),
  domainValueRegex:
    /^[a-zA-Z0-9]{3}=[a-zA-Z0-9]{3}:[a-zA-Z0-9]{3}:[a-zA-Z0-9]{24}$/,
  handleValueRegex: /^[a-zA-Z0-9][a-zA-Z0-9.-]+[a-zA-Z0-9]$/,
};

export default regex;
