-- CreateTable
CREATE TABLE `Step2` (
    `id` VARCHAR(191) NOT NULL,
    `country_id` VARCHAR(191) NULL,
    `state_id` VARCHAR(191) NULL,
    `district_id` VARCHAR(191) NULL,
    `city_id` VARCHAR(191) NULL,
    `postal_id` VARCHAR(191) NULL,
    `house_type` VARCHAR(191) NULL,
    `stay_from_date` VARCHAR(191) NULL,
    `stay_till_date` VARCHAR(191) NULL,
    `full_address` VARCHAR(191) NULL,
    `address_proof_file` LONGBLOB NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Step2_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step2` ADD CONSTRAINT `Step2_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
