/*
  Warnings:

  - You are about to drop the `Step4` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Step4` DROP FOREIGN KEY `Step4_userid_fkey`;

-- DropTable
DROP TABLE `Step4`;

-- CreateTable
CREATE TABLE `StepNo4` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ref_name` VARCHAR(191) NULL,
    `ref_designation` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `ref_contact_num` VARCHAR(191) NULL,
    `ref_email` VARCHAR(191) NULL,
    `ref_relationship` VARCHAR(191) NULL,

    UNIQUE INDEX `StepNo4_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StepNo4` ADD CONSTRAINT `StepNo4_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
