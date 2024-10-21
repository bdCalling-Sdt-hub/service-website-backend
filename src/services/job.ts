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
  businessId,
}: {
  limit: number;
  skip: number;
  businessId?: string;
}) {
  return prisma.jobs.findMany({
    take: limit,
    skip,
    where: {
      businessId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countJobs({ businessId }: { businessId: string }) {
  return prisma.jobs.count({
    where: {
      businessId,
    },
  });
}
