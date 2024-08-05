import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function createBusiness({
  abn,
  about,
  license,
  name,
  openHour,
  subscriptionEndAt,
  website,
  mainServiceId,
  suburbId,
  userId,
}: {
  abn: string;
  about: string;
  license: string;
  name: string;
  openHour: number;
  subscriptionEndAt: Date;
  website: string;
  mainServiceId: string;
  suburbId: string;
  userId: string;
}) {
  return prisma.businesses.create({
    data: {
      abn,
      about,
      license,
      name,
      openHour,
      subscriptionEndAt,
      website,
      mainServiceId,
      suburbId,
      userId,
    },
  });
}
