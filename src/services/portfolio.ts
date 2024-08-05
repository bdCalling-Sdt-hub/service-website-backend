import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function portfolioCreate({
  name,
  image,
  businessId,
}: {
  name: string;
  image: string;
  businessId: string;
}) {
  return prisma.portfolios.create({
    data: {
      name,
      image,
      businessId,
    },
  });
}
