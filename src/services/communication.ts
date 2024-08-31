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

export function getCommunications({
  limit,
  skip,
  businessId,
}: // type,
{
  limit: number;
  skip: number;
  businessId?: string;
  // type?: "CALL" | "MESSAGE";
}) {
  return prisma.communications.findMany({
    take: limit,
    skip,
    where: {
      businessId,
      // status: "PENDING",
    },
  });
}

export function countCommunications(businessId?: string) {
  return prisma.communications.count({ where: { businessId } });
}

export function getCommunicationById(id: string) {
  return prisma.communications.findUnique({
    where: { id },
    include: { user: true, business: { include: { user: true } } },
  });
}

export function updateCommunication({
  businessId,
  status,
  newStatus,
}: {
  businessId: string;
  status: "SENDED" | "PENDING";
  newStatus?: "SENDED" | "REVIEWED";
}) {
  return prisma.communications.updateMany({
    where: { businessId, status },
    data: {
      status: newStatus,
    },
  });
}
