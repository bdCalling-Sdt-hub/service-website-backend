import { PrismaClient } from "@prisma/client";


export function createAppData({
  about,
  privacy,
  terms,
}: {
  about: string;
  privacy: string;
  terms: string;
}) {
  const prisma = new PrismaClient();

  return prisma.appData.create({
    data: {
      about,
      privacy,
      terms,
    },
  });
}

export function getAppData() {
const prisma = new PrismaClient();

  return prisma.appData.findFirst({
    select: { about: true, privacy: true, terms: true },
  });
}

export async function updateAppData(data: {
  about?: string;
  privacy?: string;
  terms?: string;
}) {
  const prisma = new PrismaClient();
  
  const appData = await prisma.appData.findFirst();

  return prisma.appData.update({
    where: {
      id: appData?.id,
    },
    data,
    select: { about: true, privacy: true, terms: true },
  });
}
