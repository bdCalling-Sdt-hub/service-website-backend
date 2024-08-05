import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createSuburb({
  name,
  postCode,
}: {
  name: string;
  postCode: string;
}) {
  return prisma.suburbs.create({
    data: {
      name,
      postCode,
    },
  });
}

