/*
  Warnings:

  - You are about to drop the `StepNo4` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `StepNo4` DROP FOREIGN KEY `StepNo4_userId_fkey`;

-- DropTable
DROP TABLE `StepNo4`;

-- CreateTable
CREATE TABLE `Step4` (
    `id` VARCHAR(191) NOT NULL,
    `ref_name` VARCHAR(191) NULL,
    `ref_designation` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `ref_contact_num` VARCHAR(191) NULL,
    `ref_email` VARCHAR(191) NULL,
    `ref_relationship` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Step4_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step4` ADD CONSTRAINT `Step4_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
