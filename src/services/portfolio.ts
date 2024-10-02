import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createPortfolio({
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

export function getPortfolios({
  limit,
  skip,
  businessId,
}: {
  limit: number;
  skip: number;
  businessId: string;
}) {
  
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
  
  return prisma.portfolios.count({ where: { businessId } });
}

export function deletePortfolio(id: string) {
  
  return prisma.portfolios.delete({
    where: {
      id,
    },
  });
}


export function getPortfolioById(id: string) {
  
  return prisma.portfolios.findUnique({
    where: {
      id,
    },
  });
}