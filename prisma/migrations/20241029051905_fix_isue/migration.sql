/*
  Warnings:

  - A unique constraint covering the columns `[jobId,userId]` on the table `JobApplications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Services_name_key` ON `Services`;

-- AlterTable
ALTER TABLE `Jobs` MODIFY `description` LONGTEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `JobApplications_jobId_userId_key` ON `JobApplications`(`jobId`, `userId`);
