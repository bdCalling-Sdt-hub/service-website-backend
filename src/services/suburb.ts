import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createSuburbs(
  data: {
    name: string;
    postcode: string;
    latitude: number;
    longitude: number;
  }[]
) {

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

  return prisma.suburbs.count({
    where: {
      postcode:{
        startsWith: postcode
      }
    },
  });
}