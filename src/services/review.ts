import { PrismaClient } from "@prisma/client";


export function createReview({
  businessId,
  userId,
  rating,
  message,
}: {
  businessId: string;
  userId: string;
  rating: number;
  message: string;
}) {
  const prisma = new PrismaClient();
  return prisma.reviews.create({
    data: {
      businessId,
      userId,
      rating,
      message,
    },
  });
}

export function getReviews({
  limit,
  skip,
  businessId,
}: {
  limit: number;
  skip: number;
  businessId?: string;
}) {
  const prisma = new PrismaClient();
  return prisma.reviews.findMany({
    take: limit,
    skip,
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
        },
      },
      business: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function countReviews({ businessId }: { businessId?: string }) {
  const prisma = new PrismaClient();
  return prisma.reviews.count({
    where: {
      businessId,
    },
  });
}

export function overallRating({ businessId }: { businessId: string }) {
const prisma = new PrismaClient();
  return prisma.reviews.aggregate({
    where: {
      businessId,
    },
    _avg: {
      rating: true,
    },
  });
}

export function countTotalStar(businessId: string) {
const prisma = new PrismaClient();
  return prisma.reviews.aggregate({
    where: {
      businessId,
    },
    _sum: {
      rating: true,
    },
  });
}

export function totalStartByGroup(businessId: string) {
const prisma = new PrismaClient();
  return prisma.reviews.groupBy({
    by: ["rating"],
    where: {
      businessId,
    },
    _count: {
      rating: true,
    },
  });
}
