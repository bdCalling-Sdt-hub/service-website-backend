import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export function createUser({
  firstName,
  lastName,
  email,
  password,
  mobile,
  type,
}: {
  firstName: string;
  lastName: string;
  email: string;
  type: "CUSTOMER" | "PROVIDER";
  password: string;
  mobile?: string;
}) {
  
  return prisma.users.create({
    data: {
      firstName,
      lastName,
      email,
      password,
      mobile,
      type,
    },
    select: {
      id: true,
    },
  });
}

export function getUserByEmail(email: string) {
  
  return prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      business: {
        select: {
          id: true,
          abn: true,
          about: true,
          license: true,
          name: true,
          openHour: true,
          mobile: true,
          phone: true,
          facebook: true,
          instagram: true,
          website: true,
          address: true,
          suburb: true,
          postalCode: true,
          state: true,
          services: true,
          mainServiceId: true,
          mainService: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
}

export function getUserById(id: string, takePassword = false) {
  
  return prisma.users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      type: true,
      image: true,
      isVerified: true,
      isDeleted: true,
      password: takePassword,
      business: {
        select: {
          id: true,
          abn: true,
          about: true,
          license: true,
          name: true,
          openHour: true,
          mobile: true,
          phone: true,
          facebook: true,
          instagram: true,
          website: true,
          address: true,
          suburb: true,
          postalCode: true,
          state: true,
          services: true,
          mainServiceId: true,
          mainService: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
}

export function updateUserById(
  id: string,
  {
    image,
    firstName,
    lastName,
    mobile,
    isVerified,
    password,
  }: {
    image?: string;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    isVerified?: boolean;
    password?: string;
  }
) {
  
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      image,
      firstName,
      lastName,
      mobile,
      isVerified,
      password,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      type: true,
      image: true,
      isVerified: true,
    },
  });
}

export function getAdmin() {
  
  return prisma.users.findFirst({
    where: {
      type: "ADMIN",
    },
  });
}

export function getUsers({
  limit,
  skip,
  type,
  startDate,
  endDate,
  name,
}: {
  limit: number;
  skip: number;
  type?: "CUSTOMER" | "PROVIDER";
  startDate?: Date;
  endDate?: Date;
  name?: string;
}) {
  
  return prisma.users.findMany({
    take: limit,
    skip,
    where: {
      type,
      isDeleted: false,
      firstName: {
        contains: name,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function countUsers({
  endDate,
  name,
  startDate,
  type,
}: {
  type?: "CUSTOMER" | "PROVIDER";
  startDate?: Date;
  endDate?: Date;
  name?: string;
}) {
  
  return prisma.users.count({
    where: {
      type,
      firstName: {
        contains: name,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export function deleteUserById(id: string) {
  
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });
}

export function createAdmin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  
  return prisma.users.create({
    data: {
      email,
      firstName: "Mr.",
      lastName: "Admin",
      password,
      type: "ADMIN",
      isVerified: true,
    },
  });
}
