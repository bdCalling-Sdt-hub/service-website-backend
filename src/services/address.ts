import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getAddresses({
  limit,
  skip,
  postalCode,
  state,
  suburb,
}: {
  limit: number;
  skip: number;
  suburb?: string;
  state?: string;
  postalCode?: string;
}) {
  return prisma.addresses.findMany({
    take: limit,
    skip,
    where: {
      state: {
        startsWith: state,
        mode: "insensitive",
      },
      suburb: {
        startsWith: suburb,
        mode: "insensitive",
      },
      postalCode: {
        startsWith: postalCode,
        mode: "insensitive",
      },
    },
  });
}

export function countAddresses({
  postalCode,
  state,
  suburb,
}: {
  suburb?: string;
  state?: string;
  postalCode?: string;
}) {
  return prisma.addresses.count({
    where: {
      state: {
        startsWith: state,
        mode: "insensitive",
      },
      suburb: {
        startsWith: suburb,
        mode: "insensitive",
      },
      postalCode: {
        startsWith: postalCode,
        mode: "insensitive",
      },
    },
  });
}

export function createManyAddress(
  addresses: {
    suburb: string;
    state: string;
    postalCode: string;
  }[]
) {
  return prisma.addresses.createMany({
    data: addresses,
  });
}

export function getAddressById(addressId: string) {
  return prisma.addresses.findUnique({
    where: {
      id: addressId,
    },
  });
}

export function getStates() {
  return prisma.addresses.groupBy({
    by: ["state"],
  });
}