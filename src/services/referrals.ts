import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createReferral({
  userId,
  businessId,
  name,
  email,
  phone,
}: {
  userId: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
}) {
  return prisma.referrals.create({
    data: {
      userId,
      businessId,
      name,
      email,
      phone,
    },
  });
}

export function getReferrals({
  businessId,
  skip,
  limit,
}: {
  businessId: string;
  limit: number;
  skip: number;
}) {
  return prisma.referrals.findMany({
    where: {
      businessId,
    },
    take: limit,
    skip,
    include: {
      user: {
        select: {
          lastName: true,
          firstName: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countReferrals(businessId: string) {
  return prisma.referrals.count({
    where: {
      businessId,
    },
  });
}
