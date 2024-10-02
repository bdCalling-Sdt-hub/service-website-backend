import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export function createSubscription({
  name,
  minimumStart,
  price,
  benefits,
  priceId,
}: {
  name: string;
  minimumStart?: number;
  price: number;
  priceId: string;
  benefits: string[];
}) {
  
  return prisma.subscriptions.create({
    data: {
      name,
      minimumStart,
      benefits,
      price,
      priceId,
    },
  });
}

export function getSubscriptions({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}) {
  
  return prisma.subscriptions.findMany({
    take: limit,
    skip,
    orderBy: {
      minimumStart: "asc",
    },
    where: {
      isDeleted: false,
    },
  });
}

export function getSubscriptionById(id: string) {
  
  return prisma.subscriptions.findUnique({
    where: {
      id,
    },
  });
}

export function countSubscriptions() {
  
  return prisma.subscriptions.count({
    where: {
      isDeleted: false,
    },
  });
}

export function updateSubscription(
  id: string,
  {
    name,
    minimumStart,
    price,
    benefits,
  }: {
    name?: string;
    minimumStart?: number;
    price?: number;
    benefits?: string[];
  }
) {
  
  return prisma.subscriptions.update({
    where: {
      id,
    },
    data: {
      name,
      minimumStart,
      price,
      benefits,
    },
  });
}

export function deleteSubscription(id: string) {
  
  return prisma.subscriptions.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export function getDefaultSubscription() {
  
  return prisma.subscriptions.findFirst({
    where: {
      minimumStart: undefined,
      isDeleted: false,
    },
  });
}

export function getSubscriptionByPriceId(priceId: string) {
  
  return prisma.subscriptions.findFirst({
    where: {
      priceId,
      isDeleted: false,
    },
  });
}
