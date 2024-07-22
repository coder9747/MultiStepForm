-- CreateTable
CREATE TABLE `Step3` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pan_number` VARCHAR(191) NULL,
    `pan_card` LONGBLOB NULL,
    `cibil_score` VARCHAR(191) NULL,
    `cibil_report` LONGBLOB NULL,
    `aadhar_number` VARCHAR(191) NULL,
    `aadhar_card` LONGBLOB NULL,

    UNIQUE INDEX `Step3_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step3` ADD CONSTRAINT `Step3_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
