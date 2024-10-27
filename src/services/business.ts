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
  const filters = [];

  filters.push(`b.subscriptionEndAt >= NOW()`);

  if (name) {
    filters.push(`b.name LIKE '${name}%'`);
  }

  if (serviceId) {
    filters.push(`b.mainServiceId = '${serviceId}'`);
  }

  if (startDate && endDate) {
    filters.push(
      `b.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`
    );
  }

  const businesses = (await prisma.$queryRawUnsafe(
    `
SELECT 
  b.id,
  b.about,
  b.address,
  b.facebook,
  b.instagram,
  b.mainServiceId,
  b.name,
  b.mobile,
  b.phone,
  b.postalCode,
  b.services,
  b.suburb,
  b.state,
  b.openHour,
  b.userId,
  b.website,
  b.createdAt,
  ms.name as mainServiceName,
  u.image as userImage,
  u.email as userEmail,
  
  (SELECT SUM(CASE 
               WHEN r.rating = 5 THEN (r.discount / 5.0) + 1 
               ELSE r.discount / 5.0 
             END)
   FROM Reviews r 
   WHERE r.businessId = b.id) as reviewCount,
  (SELECT s.name 
   FROM Payments p
   JOIN Subscriptions s ON p.subscriptionId = s.id
   WHERE p.businessId = b.id
   ORDER BY p.createdAt DESC
   LIMIT 1) as subscriptionName,
  (SELECT s.id 
   FROM Payments p
   JOIN Subscriptions s ON p.subscriptionId = s.id
   WHERE p.businessId = b.id
   ORDER BY p.createdAt DESC
   LIMIT 1) as subscriptionId
  ${
    latitude && longitude
      ? `, 6371 * acos(cos(radians(${latitude})) * cos(radians(b.latitude)) * cos(radians(b.longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(b.latitude))) as distance`
      : ""
  }
FROM Businesses b
LEFT JOIN Services ms ON b.mainServiceId = ms.id
LEFT JOIN Users u ON b.userId = u.id
${filters.length ? `WHERE ` + filters.join(" AND ") : ""}
ORDER BY b.priorityIndex ASC${latitude && longitude ? `, distance ASC` : ""}
LIMIT ${limit} OFFSET ${skip};
`
  )) as any[];

  return businesses.reduce((acc, business) => {
    return [
      ...acc,
      {
        id: business.id,
        about: business.about,
        address: business.address,
        facebook: business.facebook,
        instagram: business.instagram,
        mainServiceId: business.mainServiceId,
        name: business.name,
        mobile: business.mobile,
        phone: business.phone,
        postalCode: business.postalCode,
        services: business.services,
        suburb: business.suburb,
        state: business.state,
        openHour: business.openHour,
        userId: business.userId,
        website: business.website,
        createdAt: business.createdAt,
        mainService: {
          name: business.mainServiceName,
        },
        user: {
          image: business.userImage,
          email: business.userEmail,
        },
        _count: {
          reviews: Number(business.reviewCount || 0),
        },
        payments:
          business.subscriptionName && business.subscriptionId
            ? [
                {
                  subscription: {
                    name: business.subscriptionName,
                    id: business.subscriptionId,
                  },
                },
              ]
            : [],
      },
    ];
  }, []);
}

export async function countBusinesses({
  name,
  serviceId,
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

export async function bestsProviders(limit: number) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const businesses = (await prisma.$queryRawUnsafe(
    `
SELECT 
  b.id,
  b.about,
  b.address,
  b.facebook,
  b.instagram,
  b.mainServiceId,
  b.name,
  b.mobile,
  b.phone,
  b.postalCode,
  b.services,
  b.suburb,
  b.state,
  b.openHour,
  b.userId,
  b.website,
  b.createdAt,
  ms.name as mainServiceName,
  u.image as userImage,
  u.email as userEmail,
  
  (SELECT SUM(CASE 
               WHEN r.rating = 5 THEN (r.discount / 5.0) + 1 
               ELSE r.discount / 5.0 
             END)
   FROM Reviews r 
   WHERE r.businessId = b.id AND r.createdAt >= '${thirtyDaysAgo.toISOString()}') as reviewCount,
  (SELECT s.name 
   FROM Payments p
   JOIN Subscriptions s ON p.subscriptionId = s.id
   WHERE p.businessId = b.id
   ORDER BY p.createdAt DESC
   LIMIT 1) as subscriptionName,
  (SELECT s.id 
   FROM Payments p
   JOIN Subscriptions s ON p.subscriptionId = s.id
   WHERE p.businessId = b.id
   ORDER BY p.createdAt DESC
   LIMIT 1) as subscriptionId
  FROM Businesses b
LEFT JOIN Services ms ON b.mainServiceId = ms.id
LEFT JOIN Users u ON b.userId = u.id
ORDER BY reviewCount DESC
LIMIT ${limit};
`
  )) as any[];

  return businesses.reduce((acc, business) => {
    return [
      ...acc,
      {
        id: business.id,
        about: business.about,
        address: business.address,
        facebook: business.facebook,
        instagram: business.instagram,
        mainServiceId: business.mainServiceId,
        name: business.name,
        mobile: business.mobile,
        phone: business.phone,
        postalCode: business.postalCode,
        services: business.services,
        suburb: business.suburb,
        state: business.state,
        openHour: business.openHour,
        userId: business.userId,
        website: business.website,
        createdAt: business.createdAt,
        mainService: {
          name: business.mainServiceName,
        },
        user: {
          image: business.userImage,
          email: business.userEmail,
        },
        _count: {
          reviews: Number(business.reviewCount || 0),
        },
        payments:
          business.subscriptionName && business.subscriptionId
            ? [
                {
                  subscription: {
                    name: business.subscriptionName,
                    id: business.subscriptionId,
                  },
                },
              ]
            : [],
      },
    ];
  }, []);
}
