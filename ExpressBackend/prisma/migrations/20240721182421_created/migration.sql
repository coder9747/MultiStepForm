-- CreateTable
CREATE TABLE `Step7` (
    `id` VARCHAR(191) NOT NULL,
    `aadharNumber` VARCHAR(191) NULL,
    `aadharUpload` LONGBLOB NULL,
    `aadharUploadMimeType` VARCHAR(191) NULL,
    `panNumber` VARCHAR(191) NULL,
    `panUpload` LONGBLOB NULL,
    `panUploadMimeType` VARCHAR(191) NULL,
    `drivingLicenseNumber` VARCHAR(191) NULL,
    `drivingLicenseUpload` LONGBLOB NULL,
    `drivingLicenseUploadMimeType` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Step7_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step7` ADD CONSTRAINT `Step7_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
