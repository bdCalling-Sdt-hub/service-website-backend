import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  return prisma.reviews.count({
    where: {
      businessId,
    },
  });
}

export function overallRating({ businessId }: { businessId: string }) {
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
