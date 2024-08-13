import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createSubscription({
  name,
  minimumStart,
  price,
  Benefits,
}: {
  name: string;
  minimumStart: number;
  price: number;
  Benefits: string[];
}) {
  return prisma.subscriptions.create({
    data: {
      name,
      minimumStart,
      Benefits,
      price,
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
      createdAt: "desc",
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
    Benefits,
  }: {
    name?: string;
    minimumStart?: number;
    price?: number;
    Benefits?: string[];
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
      Benefits,
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
