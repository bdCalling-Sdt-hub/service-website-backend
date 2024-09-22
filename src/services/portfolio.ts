import { PrismaClient } from "@prisma/client";


export function createPortfolio({
  name,
  image,
  businessId,
}: {
  name: string;
  image: string;
  businessId: string;
}) {
  const prisma = new PrismaClient();
  return prisma.portfolios.create({
    data: {
      name,
      image,
      businessId,
    },
  });
}

export function getPortfolios({
  limit,
  skip,
  businessId,
}: {
  limit: number;
  skip: number;
  businessId: string;
}) {
  const prisma = new PrismaClient();
  return prisma.portfolios.findMany({
    take: limit,
    skip,
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countPortfolios(businessId: string) {
  const prisma = new PrismaClient();
  return prisma.portfolios.count({ where: { businessId } });
}

export function deletePortfolio(id: string) {
  const prisma = new PrismaClient();
  return prisma.portfolios.delete({
    where: {
      id,
    },
  });
}


export function getPortfolioById(id: string) {
  const prisma = new PrismaClient();
  return prisma.portfolios.findUnique({
    where: {
      id,
    },
  });
}