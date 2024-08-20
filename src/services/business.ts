import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createBusiness({
  abn,
  about,
  license,
  name,
  openHour,
  mainServiceId,
  address,
  userId,
  mobile,
  city,
  facebook,
  instagram,
  website,
  phone,
  postalCode,
  state,
  services,
}: {
  abn: number;
  mobile: string;
  about: string;
  license: string | undefined;
  name: string;
  openHour: string;
  mainServiceId: string;
  address: string;
  userId: string;
  city: string;
  postalCode: string;
  state: string;
  phone: string | undefined;
  facebook: string | undefined;
  instagram: string | undefined;
  website: string | undefined;
  services: string[];
}) {
  return prisma.businesses.create({
    data: {
      abn,
      mobile,
      about,
      license,
      name,
      openHour,
      mainServiceId,
      address,
      userId,
      city,
      postalCode,
      state,
      phone,
      services,
      facebook,
      instagram,
      website,
    },
  });
}

export function getBusinesses({
  limit,
  skip,
  name,
  address,
}: {
  limit: number;
  skip: number;
  name?: string;
  address?: string;
}) {
  return prisma.businesses.findMany({
    take: limit,
    skip,
    where: {
      name: {
        startsWith: name,
      },
      address: {
        startsWith: address,
      },
    },
    orderBy: {
      priorityIndex: "asc",
    },
  });
}

export function countBusinesses({
  name,
  address,
}: {
  name?: string;
  address?: string;
}) {
  return prisma.businesses.count({
    where: {
      name: {
        startsWith: name,
      },
      address: {
        startsWith: address,
      },
    },
  });
}

export function updateBusiness(
  id: string,
  {
    abn,
    about,
    license,
    name,
    openHour,
    mobile,
    phone,
    facebook,
    instagram,
    website,
    subscriptionEndAt,
  }: {
    abn?: number;
    mobile?: string;
    about?: string;
    license?: string;
    name?: string;
    openHour?: string;
    phone?: string;
    facebook?: string;
    instagram?: string;
    website?: string;
    subscriptionEndAt?: Date;
  }
) {
  return prisma.businesses.update({
    where: {
      id,
    },
    data: {
      abn,
      mobile,
      about,
      license,
      name,
      openHour,
      phone,
      facebook,
      instagram,
      website,
      subscriptionEndAt,
    },
  });
}

export function getBusinessById(id: string) {
  return prisma.businesses.findUnique({
    where: {
      id,
    },
  });
}
