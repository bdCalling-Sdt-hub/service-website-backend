import { PrismaClient } from "@prisma/client";


export function createSuburbs(
  data: {
    name: string;
    postcode: string;
    latitude: number;
    longitude: number;
  }[]
) {
const prisma = new PrismaClient();
  return prisma.suburbs.createMany({
    data,
  });
}

export function getSuburbs({
  limit,
  skip,
  postcode,
}: {
  limit: number;
  skip: number;
  postcode?: string;
}) {
const prisma = new PrismaClient();
  return prisma.suburbs.findMany({
    where: {
      postcode:{
        startsWith: postcode
      }
    },
    take: limit,
    skip,
  });
}

export function countSuburbs(postcode?: string) {
const prisma = new PrismaClient();
  return prisma.suburbs.count({
    where: {
      postcode:{
        startsWith: postcode
      }
    },
  });
}