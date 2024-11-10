import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createPromotion({
  businessId,
  title,
  discount,
  startAt,
  endAt,
}: {
  businessId: string;
  title: string;
  discount: number;
  startAt: Date;
  endAt: Date;
}) {
  return prisma.promotions.create({
    data: {
      businessId,
      title,
      discount,
      startAt,
      endAt,
    },
  });
}

export function deletePromotion(id: string) {
  return prisma.promotions.delete({
    where: {
      id,
    },
  });
}

export function getExistingPromotion({
  businessId,
  startDate,
}: {
  businessId: string;
  startDate?: Date;
  endDate?: Date;
  title?: string;
}) {
  return prisma.promotions.findFirst({
    where: {
      businessId,
      endAt: {
        gte: startDate,
      },
    },
  });
}

export function getPromotionById(id: string) {
  return prisma.promotions.findUnique({
    where: {
      id,
    },
  });
}

export function getPromotions({
  limit,
  skip,
  businessId,
}: {
  limit: number;
  skip: number;
  businessId?: string;
}) {
  return prisma.promotions.findMany({
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

export function countPromotions({ businessId }: { businessId?: string }) {
  return prisma.promotions.count({
    where: {
      businessId,
    },
  });
}
