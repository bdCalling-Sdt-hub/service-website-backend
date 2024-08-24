import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createBusiness({
  userId,
  name,
  mainServiceId,
  mobile,
  phone,
  abn,
  address,
  suburb,
  state,
  postalCode,
}: {
  abn: number;
  name: string;
  address: string;
  suburb: string;
  mobile: string;
  phone?: string;
  postalCode: string;
  state: string;
  userId: string;
  mainServiceId: string;
}) {
  return prisma.businesses.create({
    data: {
      abn,
      address,
      suburb,
      mobile,
      name,
      phone,
      postalCode,
      state,
      userId,
      mainServiceId,
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
    include: {
      mainService: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          image: true,
          email: true,
        },
      },
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
    services,
    subscriptionEndAt,
    address,
    mainServiceId,
    state,
    suburb,
    postalCode,
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
    services?: string[];
    subscriptionEndAt?: Date;
    address?: string;
    mainServiceId?: string;
    state?: string;
    suburb?: string;
    postalCode?: string;
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
      services,
      address,
      mainServiceId,
      state,
      suburb,
      postalCode,
    },
  });
}

export function getBusinessById(id: string) {
  return prisma.businesses.findUnique({
    where: {
      id,
    },
    include: {
      mainService: {
        select: {
          name: true,
        },
      },
      user: {
        select: {
          image: true,
          email: true,
        },
      },
    },
  });
}
