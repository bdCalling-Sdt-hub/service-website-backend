import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export function getLastPaymentByUserId(businessId: string) {
  return prisma.payments.findFirst({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });
}

export function totalEarnings() {
  return prisma.payments.aggregate({
    _sum: {
      amount: true,
    },
  });
}

export function getPaymentsByYear(year: string) {
  return prisma.payments.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year}-12-31`),
      },
    },
  });
}