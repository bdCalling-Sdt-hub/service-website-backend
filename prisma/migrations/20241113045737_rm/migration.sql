/*
  Warnings:

  - You are about to drop the column `name` on the `Portfolios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Portfolios` DROP COLUMN `name`;

-- CreateTable
CREATE TABLE `Promotions` (
    `id` VARCHAR(191) NOT NULL,
    `businessId` VARCHAR(191) NOT NULL,
    `discount` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(3) NOT NULL,
    `endAt` DATETIME(3) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_businessId_fkey` FOREIGN KEY (`businessId`) REFERENCES `Businesses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
