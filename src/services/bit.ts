import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createBit({
  userId,
  description,
  image,
  latitude,
  longitude,
  serviceId,
  communicationPreference,
}: {
  userId: string;
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  serviceId: string;
  communicationPreference: "email" | "call";
}) {
  return prisma.bits.create({
    data: {
      userId,
      description,
      image,
      latitude,
      longitude,
      serviceId,
      communicationPreference,
    },
  });
}

export function getBits({
  limit,
  skip,
  serviceId,
  latitude,
  longitude,
}: {
  limit: number;
  skip: number;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
}) {
  return prisma.bits.findMany({
    take: limit,
    skip,
    where: {
      serviceId,
      latitude,
      longitude,
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
          email: true,
          mobile: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function countBits({
  serviceId,
  latitude,
  longitude,
}: {
  serviceId?: string;
  latitude?: number;
  longitude?: number;
}) {
  return prisma.bits.count({
    where: {
      serviceId,
      latitude,
      longitude,
    },
  });
}