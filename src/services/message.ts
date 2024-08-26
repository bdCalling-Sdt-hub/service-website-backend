import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createMessage({
  userId,
  businessId,
  message,
}: {
  userId: string;
  businessId: string;
  message: string;
}) {
  return prisma.messages.create({
    data: {
      userId,
      businessId,
      message,
    },
  });
}

export function getMessages({
  businessId,
  limit,
  skip,
}: {
  businessId?: string;
  limit: number;
  skip: number;
}) {
  return prisma.messages.findMany({
    where: {
      businessId,
    },
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
          email: true,
          mobile: true,
        },
      },
    },
  });
}

export function countMessages(businessId?: string) {
  return prisma.messages.count({
    where: {
      businessId,
    },
  });
}
