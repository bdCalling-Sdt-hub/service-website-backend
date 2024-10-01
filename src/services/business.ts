import { PrismaClient } from "@prisma/client";

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
  const prisma = new PrismaClient();

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
      // coordinates: [longitude, latitude],
      latitude,
      longitude,
    },
  });
}

export async function getBusinesses({
  limit,
  skip,
  name,
  serviceId,
  latitude,
  longitude,
  startDate,
  endDate,
}: {
  limit: number;
  skip: number;
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const prisma = new PrismaClient();

  let businessIds = undefined;
  if (latitude && longitude) {
    const businesses = (await prisma.$queryRawUnsafe(
      `SELECT id FROM Businesses WHERE (6371 * ACOS(COS(RADIANS(40.7128)) * COS(RADIANS(${latitude})) * COS(RADIANS(${longitude}) - RADIANS(-74.0060)) + SIN(RADIANS(40.7128)) * SIN(RADIANS(${latitude})))) < 100000`
    )) as [{ id: string }];

    businessIds = businesses.map((business: any) => business.id);
  }

  if (businessIds && businessIds.length === 0) {
    return [];
  }

  return prisma.businesses.findMany({
    take: limit,
    skip,
    where: {
      name: {
        startsWith: name,
        // mode: "insensitive",
      },
      mainServiceId: serviceId,
      id: {
        in: businessIds,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
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
      _count: {
        select: {
          reviews: {
            where: {
              rating: 5,
            },
          },
        },
      },
      payments: {
        select: {
          subscription: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function countBusinesses({
  name,
  serviceId,
  latitude,
  longitude,
  endDate,
  startDate,
}: {
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
  startDate?: Date;
  endDate?: Date;
}) {
  const prisma = new PrismaClient();

  const query: string[] = [];

  if (latitude && longitude) {
    query.push(
      `(6371 * ACOS(COS(RADIANS(40.7128)) * COS(RADIANS(${latitude})) * COS(RADIANS(${longitude}) - RADIANS(-74.0060)) + SIN(RADIANS(40.7128)) * SIN(RADIANS(${latitude})))) < 1000`
    );
  }

  if (name) {
    query.push(`name LIKE '${name}%'`);
  }

  if (serviceId) {
    query.push(`mainServiceId = '${serviceId}'`);
  }

  if (startDate && endDate) {
    query.push(
      `createdAt >= '${startDate.toISOString()}' AND createdAt <= '${endDate.toISOString()}'`
    );
  }

  const queryStr =
    `SELECT COUNT(*) AS businessesCount FROM Businesses ` +
    (query.length > 0 ? `WHERE ${query.join(" AND ")}` : "");

  const count = (await prisma.$queryRawUnsafe(queryStr)) as [
    { businessesCount: BigInt }
  ];

  return Number(count[0].businessesCount);
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
  const prisma = new PrismaClient();

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
      // coordinates: latitude && longitude ? [longitude, latitude] : undefined,
      latitude,
      longitude,
    },
  });
}

export function getBusinessById(id: string) {
  const prisma = new PrismaClient();

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

export function increasePriorityIndex(id: string) {
  const prisma = new PrismaClient();

  return prisma.businesses.update({
    where: {
      id,
    },
    data: {
      priorityIndex: {
        increment: 1,
      },
    },
  });
}

export function businessReport({
  endDate,
  startDate,
  suburb,
  active,
  businessName,
  serviceId,
  workStatus,
  subscriptionId,
}: {
  startDate: Date;
  endDate: Date;
  businessName?: string;
  serviceId?: string;
  suburb?: string;
  active?: boolean;
  workStatus?: boolean;
  subscriptionId?: string;
}) {
  const prisma = new PrismaClient();

  return prisma.businesses.findMany({
    where: {
      name: businessName,
      mainServiceId: serviceId,
      suburb,
      subscriptionEndAt: active
        ? {
            gte: new Date(),
          }
        : undefined,

      payments: {
        some: {
          subscriptionId,
        },
      },
      Communications:
        workStatus === undefined
          ? undefined
          : {
              ...(workStatus
                ? {
                    some: {
                      createdAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  }
                : {
                    none: {
                      createdAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                  }),
            },
    },
    select: {
      name: true,
      address: true,
      suburb: true,
      mobile: true,
      mainService: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          Communications: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      },
    },
  });
}

export function businessCommunications({
  endDate,
  skip,
  startDate,
  take,
}: {
  startDate: Date;
  endDate: Date;
  take: number;
  skip: number;
}) {
  const prisma = new PrismaClient();

  return prisma.businesses.findMany({
    take,
    skip,
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      Communications: {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}
