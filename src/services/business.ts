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
  license,
  latitude,
  longitude,
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
  latitude: number;
  longitude: number;
  license?: string;
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
      license,
      latitude,
      longitude,
    },
  });
}

export function getBusinesses({
  limit,
  skip,
  name,
  serviceId,
  latitude,
  longitude,
}: {
  limit: number;
  skip: number;
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
}) {
  return prisma.businesses.findMany({
    take: limit,
    skip,
    where: {
      name: {
        startsWith: name,
        mode: "insensitive",
      },
      mainServiceId: serviceId,
      latitude,
      longitude,
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
      _count: {
        select: {
          reviews: {
            where: {
              rating: 5,
            },
          },
        },
      },
    },
  });
}

export function countBusinesses({
  name,
  serviceId,
  latitude,
  longitude,
}: {
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
}) {
  return prisma.businesses.count({
    where: {
      name: {
        startsWith: name,
        mode: "insensitive",
      },
      mainServiceId: serviceId,
      latitude,
      longitude,
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
    latitude,
    longitude,
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
    latitude?: number;
    longitude?: number;
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
      latitude,
      longitude,
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
