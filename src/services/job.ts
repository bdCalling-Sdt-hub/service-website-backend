import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createJob({
  description,
  email,
  phone,
  title,
  businessId,
}: {
  description: string;
  email: string;
  phone: string;
  title: string;
  businessId: string;
}) {
  return prisma.jobs.create({
    data: {
      description,
      email,
      phone,
      title,
      businessId,
    },
  });
}

export function getJobs({
  limit,
  skip,
  createdAt = "desc",
  latitude,
  longitude,
  businessId,
}: {
  limit: number;
  skip: number;
  createdAt: "desc" | "asc";
  latitude?: number;
  longitude?: number;
  businessId?: string;
}) {
  return prisma.jobs.findMany({
    take: limit,
    skip,
    where: {
      business: {
        latitude,
        longitude,
      },
      businessId,
    },
    orderBy: {
      createdAt,
    },
  });
}

export function countJobs({
  businessId,
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
  businessId?: string;
}) {
  return prisma.jobs.count({
    where: {
      business: {
        latitude,
        longitude,
      },
      businessId,
    },
  });
}
