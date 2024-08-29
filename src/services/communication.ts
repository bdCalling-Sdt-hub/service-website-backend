import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createCommunication({
  userId,
  businessId,
  type,
  message,
}: {
  userId?: string;
  businessId: string;
  message?: string;
  type: "CALL" | "MESSAGE";
}) {
  return prisma.communications.create({
    data: {
      userId,
      businessId,
      message,
      type,
    },
  });
}

export function getPendingCommunications({
  limit,
  skip,
}: {
  limit: number;
  skip: number;
}) {
  return prisma.communications.findMany({
    take: limit,
    skip,
    where: {
      status: "PENDING",
    },
  });
}