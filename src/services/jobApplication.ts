import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export function createJobApplication({
  jobId,
  userId,
  resume,
}: {
  jobId: string;
  userId: string;
  resume: string;
}) {
  return prisma.jobApplications.create({
    data: {
      jobId,
      userId,
      resume,
    },
  });
}

export function getJobApplications({
  limit,
  skip,
  jobId,
}: {
  limit: number;
  skip: number;
  jobId?: string;
}) {
  return prisma.jobApplications.findMany({
    take: limit,
    skip,
    where: {
      jobId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          mobile: true,
          image: true,
          email: true,
        },
      },
    },
  });
}

export function countJobApplications({ jobId }: { jobId?: string }) {
  return prisma.jobApplications.count({
    where: {
      jobId,
    },
  });
}

export function getJobApplicationByUserIdAndJobId({
  userId,
  jobId,
}: {
  userId: string;
  jobId: string;
}) {
  return prisma.jobApplications.findFirst({
    where: {
      userId,
      jobId,
    },
  });
}
