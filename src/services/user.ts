import { PrismaClient } from "@prisma/client";
import { UpdateUser } from "../types/user";

const prisma = new PrismaClient();

export function createUser({
  name,
  email,
  password,
  mobile,
  type,
}: {
  name: string;
  email: string;
  type: "CUSTOMER" | "PROVIDER";
  password: string;
  mobile?: string;
}) {
  return prisma.users.create({
    data: {
      name,
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
      Businesses: {
        select: {
          id: true,
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
      name: true,
      email: true,
      type: true,
      image: true,
      isVerified: true,
      Businesses: {
        select: {
          id: true,
        },
      },
      password: takePassword,
    },
  });
}

export function updateUserById(id: string, data: UpdateUser) {
  return prisma.users.update({
    where: {
      id,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      image: true,
      isVerified: true,
      Businesses: {
        select: {
          id: true,
        },
      },
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
