import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createService({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  return prisma.services.create({
    data: {
      name,
      description,
      image,
    },
  });
}
