import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { domain, handle } = req.query;
  if (
    !domain ||
    !handle ||
    typeof domain !== "string" ||
    typeof handle !== "string"
  ) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  let savedHandle = null;
  try {
    savedHandle = await prisma.handle.findFirst({
      where: {
        AND: [
          { handle: { equals: handle, mode: "insensitive" } },
          { subdomain: { equals: domain, mode: "insensitive" } },
        ],
      },
    });
  } catch (e) {
    console.error(e);
    throw Error("Could not connect to the database");
  }

  if (savedHandle) {
    res
      .status(200)
      .setHeader("content-type", "text/plain")
      .setHeader("Cache-Control", "public, max-age=86400")
      .end(`${savedHandle.subdomainValue.replace("did=", "")}`);
  }

  res.status(404).setHeader("Cache-Control", "public, max-age=300");
}
