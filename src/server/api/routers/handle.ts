import { env } from "process";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import cloudflareProvider from "~/server/domainProviders/cloudflare";
import regex from "~/utils/regex";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getProvider } from "~/utils/provider";
import { getUserProfile } from "~/utils/bsky";

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
              { handle: { equals: input.handleValue, mode: "insensitive" } },
              { subdomain: { equals: input.domainName, mode: "insensitive" } },
            ],
          },
        });
      } catch (e) {
        console.error(e);
        throw Error("Could not connect to the database");
      }

      if (handle) {
        // check the handle owner if it was checked here more than 3 days ago
        if (handle.updatedAt.getTime() + 1000 * 60 * 60 * 24 * 3 < Date.now()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const bskyUser: any = await getUserProfile(
            `${input.handleValue}.${input.domainName}`
          );

          if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            bskyUser.status === 400 &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            bskyUser.json.message === "Profile not found"
          ) {
            await prisma.handle.delete({
              where: {
                id: handle.id,
              },
            });
          } else {
            await prisma.handle.update({
              where: {
                id: handle.id,
              },
              data: {
                updatedAt: new Date(),
              },
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (bskyUser.json.did === input.domainValue) {
              throw Error("You already use this handle!");
            } else {
              throw Error("This handle is already taken!");
            }
          }
        } else {
          throw Error("This handle is already taken!");
        }
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
