import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export function createCommunication({
//   userId,
//   businessId,
//   type,
// }: {
//   userId: string;
//   businessId: string;
//   type: "CALL" | "MESSAGE";
// }) {
//   return prisma.communications.create({
//     data: {
//       userId,
//       businessId,
//       type,
//     },
//   });
// }
