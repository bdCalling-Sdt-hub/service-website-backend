import { PrismaClient } from "@prisma/client";

export function createService({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  const prisma = new PrismaClient();
  return prisma.services.create({
    data: {
      name,
      description,
      image,
    },
  });
}

export function getServices({
  take,
  skip,
  name,
}: {
  take: number;
  skip: number;
  name?: string;
}) {
  const prisma = new PrismaClient();
  return prisma.services.findMany({
    take,
    skip,
    where: {
      name: {
        startsWith: name,
        mode: "insensitive",
      },
      isDeleted: false,
    },
    select: {
      id: true,
      description: true,
      name: true,
      image: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countServices({ name }: { name?: string }) {
  const prisma = new PrismaClient();
  return prisma.services.count({
    where: {
      name: {
        startsWith: name,
      },
    },
  });
}

export function updateService(
  id: string,
  {
    name,
    description,
    image,
  }: {
    name?: string;
    description?: string;
    image?: string;
  }
) {
  const prisma = new PrismaClient();
  return prisma.services.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      image,
    },
  });
}

export function deleteService(id: string) {
  const prisma = new PrismaClient();
  return prisma.services.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export function getServiceById(id: string) {
  const prisma = new PrismaClient();
  return prisma.services.findUnique({
    where: {
      id,
    },
  });
}
