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
      coordinates: [longitude, latitude],
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
}: {
  limit: number;
  skip: number;
  name?: string;
  serviceId?: string;
  latitude?: number;
  longitude?: number;
}) {
  let businessIds = undefined;
  if (latitude && longitude) {
    const nearBusinesses = (await prisma.businesses.aggregateRaw({
      pipeline: [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            distanceField: "distance",
            maxDistance: 10000,
            spherical: true,
          } as any,
        },
        {
          $project: {
            _id: 1,
          },
        },
      ],
    })) as any;
    businessIds = nearBusinesses.map((business: any) => business._id.$oid);
  }

  return prisma.businesses.findMany({
    take: limit,
    skip,
    where: {
      name: {
        startsWith: name,
        mode: "insensitive",
      },
      mainServiceId: serviceId,
      id: {
        in: businessIds,
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
    },
  });
}

export async function countBusinesses({
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
  const pipeline: any[] = [];

  if (latitude && longitude) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        distanceField: "distance",
        maxDistance: 10000,
        spherical: true,
      },
    });
  }

  if (name || serviceId) {
    const matchCondition: any = {};

    if (name) {
      matchCondition.name = {
        $regex: `^${name}`,
        $options: "i",
      };
    }

    if (serviceId) {
      matchCondition.mainServiceId = serviceId;
    }

    pipeline.push({
      $match: matchCondition,
    });
  }

  // Add $count stage
  pipeline.push({
    $count: "businessesCount",
  });

  const businesses = (await prisma.businesses.aggregateRaw({
    pipeline,
  })) as any;

  return businesses[0]?.businessesCount ?? 0;
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
      coordinates: latitude && longitude ? [longitude, latitude] : undefined,
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
