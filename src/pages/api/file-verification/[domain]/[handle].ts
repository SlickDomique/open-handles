import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log(req.query);

  const { domain, handle } = req.query;
  console.log(domain, handle);

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
        AND: [{ handle: handle }, { subdomain: domain }],
      },
    });
  } catch (e) {
    throw Error("Could not connect to the database");
  }

  if (savedHandle) {
    res
      .status(200)
      .setHeader("content-type", "text/plain")
      .end(`${savedHandle.subdomainValue.replace("did=", "")}`);
  }

  res.status(404);
}
