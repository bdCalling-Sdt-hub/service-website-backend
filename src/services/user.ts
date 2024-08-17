import { PrismaClient } from "@prisma/client";
import { UpdateUser } from "../types/user";

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
      business: true,
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
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      type: true,
      image: true,
      isVerified: true,
      business: {
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
