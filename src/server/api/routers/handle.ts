import { env } from "process";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import cloudflareProvider from "~/server/domainProviders/cloudflare";
import regex from "~/utils/regex";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getProvider } from "~/utils/provider";

export const handleRouter = createTRPCRouter({
  createNew: publicProcedure
    .input(
      z.object({
        handleValue: z.string().regex(regex.handleValueRegex),
        domainValue: z.string().regex(regex.fileDidValue),
        domainName: z.string().regex(regex.getDomainNameRegex()),
      })
    )
    .mutation(async ({ input }) => {
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
