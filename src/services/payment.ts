import { PrismaClient } from "@prisma/client";


export function createPayment({
  businessId,
  amount,
  subscriptionId,
  transactionId,
  expireAt,
}: {
  businessId: string;
  amount: number;
  subscriptionId: string;
  transactionId: string;
  expireAt: Date;
}) {
  const prisma = new PrismaClient();
  return prisma.payments.create({
    data: {
      businessId,
      amount,
      subscriptionId,
      transactionId,
      expireAt,
    },
  });
}

export function getLastPaymentByBusinessId(businessId: string) {
  const prisma = new PrismaClient();
  return prisma.payments.findFirst({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });
}

export function totalEarnings() {
  const prisma = new PrismaClient();
  return prisma.payments.aggregate({
    _sum: {
      amount: true,
    },
  });
}

export function getPaymentsByYear(year: string) {
  const prisma = new PrismaClient();
  return prisma.payments.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
  });
}

export function getPayments({
  limit,
  skip,
  businessId,
  startDate,
  endDate,
}: {
  limit: number;
  skip: number;
  businessId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const prisma = new PrismaClient();
  return prisma.payments.findMany({
    take: limit,
    skip,
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      business: {
        select: {
          name: true,
        },
      },
      subscription: {
        select: {
          name: true,
        },
      },
    },
  });
}

export function countPayments({
  businessId,
  startDate,
  endDate,
}: {
  businessId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const prisma = new PrismaClient();
  return prisma.payments.count({
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}

export function calculateTotalEarnings({
  businessId,
  endDate,
  startDate,
}: {
  businessId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const prisma = new PrismaClient();
  return prisma.payments.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      businessId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
}
