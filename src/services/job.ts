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
  createdAt,
  latitude,
  longitude,
  businessId,
  title,
}: {
  limit: number;
  skip: number;
  createdAt: "desc" | "asc";
  latitude?: number;
  longitude?: number;
  businessId?: string;
  title?: string;
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
      title: {
        contains: title,
      },
    },
    orderBy: {
      createdAt,
    },
    include:{
      business: {
        select: {
          name: true,
          address: true,
          user:{
            select:{
              image: true,
            }
          }
        }
      }
    }
  });
}

export function countJobs({
  businessId,
  latitude,
  longitude,
  title,
}: {
  latitude?: number;
  longitude?: number;
  businessId?: string;
  title?: string;
}) {
  return prisma.jobs.count({
    where: {
      business: {
        latitude,
        longitude,
      },
      businessId,
      title: {
        contains: title,
      },
    },
  });
}


export function getJobById(id: string) {
  return prisma.jobs.findFirst({
    where: {
      id,
    },
  });
}