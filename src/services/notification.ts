import { PrismaClient } from "@prisma/client";


export function createNotification({
  userId,
  message,
}: {
  userId: string;
  message: string;
}) {
  const prisma = new PrismaClient();
  return prisma.notifications.create({
    data: {
      userId,
      message,
    },
  });
}

export function getNotificationsByUserId(
  userId: string,
  limit: number,
  skip: number
) {
  const prisma = new PrismaClient();
  return prisma.notifications.findMany({
    where: {
      userId,
    },
    take: limit,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countNotifications(userId?: string) {
  const prisma = new PrismaClient();
  return prisma.notifications.count({
    where: {
      userId,
    },
  });
}