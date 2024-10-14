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
  let businessIds = undefined;
  if (latitude && longitude) {
    const businesses = (await prisma.$queryRawUnsafe(
      `SELECT id 
      FROM Businesses  
      WHERE (
      6371 * ACOS(
        COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * 
        COS(RADIANS(longitude) - RADIANS(${longitude})) + 
        SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude))
      )) < 10000`
    )) as [{ id: string }];

    businessIds = businesses.map((business: any) => business.id);
  }

  if (businessIds && businessIds.length === 0) {
    return [];
  }

  return await prisma.businesses.findMany({
    take: limit,
    skip,
    where: {
      id: {
        in: businessIds,
      },
      mainServiceId: serviceId,
      // subscriptionEndAt: {
      //   gte: new Date(),
      // },
      name: {
        startsWith: name,
        // mode: "insensitive",
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      priorityIndex: "asc",
    },
    select: {
      id: true,
      about: true,
      address: true,
      facebook: true,
      instagram: true,
      mainServiceId: true,
      name: true,
      mobile: true,
      phone: true,
      postalCode: true,
      services: true,
      suburb: true,
      state: true,
      openHour: true,
      userId: true,
      website: true,
      createdAt: true,
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
  const query: string[] = [];

  if (latitude && longitude) {
    query.push(
      `(6371 * ACOS(COS(RADIANS(40.7128)) * COS(RADIANS(${latitude})) * COS(RADIANS(${longitude}) - RADIANS(-74.0060)) + SIN(RADIANS(40.7128)) * SIN(RADIANS(${latitude})))) < 10000`
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
    accountName,
    accountNumber,
    bankName,
    bsbNumber,
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
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    bsbNumber?: string;
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
      accountName,
      accountNumber,
      bankName,
      bsbNumber,
    },
  });
}

export function getBusinessById(id: string) {
  return prisma.businesses.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      about: true,
      address: true,
      facebook: true,
      instagram: true,
      mainServiceId: true,
      name: true,
      mobile: true,
      phone: true,
      postalCode: true,
      services: true,
      suburb: true,
      state: true,
      openHour: true,
      userId: true,
      website: true,
      createdAt: true,
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
      portfolios: {
        take: 5,
      },
    },
  });
}

export function increasePriorityIndex(id: string) {
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
