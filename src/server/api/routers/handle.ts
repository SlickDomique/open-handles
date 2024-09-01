import { env } from "process";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import cloudflareProvider from "~/server/domainProviders/cloudflare";
import regex from "~/utils/regex";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getProvider } from "~/utils/provider";

const node_env = process.env.NODE_ENV;
let rateLimiter: Ratelimit | null = null;
if (node_env !== "development") {
  rateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "15 s"),
  });
}

export const handleRouter = createTRPCRouter({
  createNew: publicProcedure
    .input(
      z.object({
        handleValue: z.string().regex(regex.handleValueRegex),
        domainValue: z.string().regex(regex.dnsDidValue),
        domainName: z.string().regex(regex.getDomainNameRegex()),
      })
    )
    .mutation(async ({ input }) => {
      if (rateLimiter) {
        const { success } = await rateLimiter.limit("1");
        if (!success) {
          throw Error("Too many requests");
        }
      }

      if (!input.handleValue || !input.domainName || !input.domainValue) {
        throw Error("Invalid input");
      }

      let handle = null;
      try {
        handle = await prisma.handle.findFirst({
          where: {
            AND: [
              { handle: input.handleValue },
              { subdomain: input.domainName },
            ],
          },
        });
      } catch (e) {
        throw Error("Could not connect to the database");
      }

      if (handle) {
        throw Error("This handle is already taken!");
      }

      const provider = getProvider(input.domainName);
      if (provider === "cloudflare") {
        const creationResult = await cloudflareProvider.createSubdomain(
          `_atproto.${input.handleValue}.${input.domainName}`,
          input.domainValue,
          input.domainName,
          "TXT"
        );

        if (!creationResult) {
          throw Error("Something went wrong. Couldn't add your handle");
        }
      }

      await prisma.handle.create({
        data: {
          handle: input.handleValue,
          subdomain: input.domainName,
          subdomainValue: input.domainValue,
        },
      });
    }),
});
