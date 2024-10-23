import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export function createService({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  
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
  
  return prisma.services.findMany({
    take,
    skip,
    where: {
      name: {
        startsWith: name,
        // mode: "insensitive",
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
      name: "asc",
    },
  });
}

export function countServices({ name }: { name?: string }) {
  
  return prisma.services.count({
    where: {
      name: {
        startsWith: name,
      },
      isDeleted: false,
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
  
  return prisma.services.findUnique({
    where: {
      id,
    },
  });
}
