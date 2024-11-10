import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createReview({
  businessId,
  userId,
  rating,
  message,
  discount,
}: {
  businessId: string;
  userId: string;
  rating: number;
  message: string;
  discount: number;
}) {
  return prisma.reviews.create({
    data: {
      businessId,
      userId,
      rating,
      message,
      discount,
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
    select:{
      id: true,
      rating: true,
      message: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
        },
      },
      business:{
        select:{
          name: true,
        }
      }
    }
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

export async function countTotalStar(businessId: string) {
  const sum = (await prisma.$queryRawUnsafe(
    `SELECT (SELECT SUM(CASE 
                 WHEN r.rating = 5 THEN (r.discount / 5.0) + 1 
                 ELSE r.discount / 5.0 
               END)
     FROM Reviews r 
     WHERE r.businessId = '${businessId}') AS totalStar`
  )) as [{ totalStar: null | BigInt }];

  return Number(sum[0].totalStar) || 0;
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
