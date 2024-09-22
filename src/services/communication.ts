import { PrismaClient } from "@prisma/client";

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
  const prisma = new PrismaClient();
  
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
}: {
  limit: number;
  skip: number;
  businessId?: string;
}) {
  const prisma = new PrismaClient();
  
  return prisma.communications.findMany({
    take: limit,
    skip,
    where: {
      businessId,
      type: businessId ? "MESSAGE" : undefined,
      status: businessId
        ? undefined
        : {
            not: "REVIEWED",
          },
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          image: true,
          mobile: true,
        },
      },
      business: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countCommunications(businessId?: string) {
  const prisma = new PrismaClient();
  
  return prisma.communications.count({ where: { businessId } });
}

export function getCommunicationById(id: string) {
  const prisma = new PrismaClient();
  
  return prisma.communications.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      business: {
        select: {
          name: true,
          address: true,
          user: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });
}

export function updateCommunication({
  businessId,
  status,
  newStatus,
  userId,
}: {
  businessId: string;
  status: "SENDED" | "PENDING";
  newStatus: "SENDED" | "REVIEWED";
  userId: string;
}) {
  const prisma = new PrismaClient();
  
  return prisma.communications.updateMany({
    where: { businessId, status, userId },
    data: {
      status: newStatus,
    },
  });
}

export function getLastCommunication({
  businessId,
  userId,
}: {
  businessId: string;
  userId?: string;
}) {
  const prisma = new PrismaClient();
  
  return prisma.communications.findFirst({
    where: { businessId, userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}
