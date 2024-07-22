-- CreateTable
CREATE TABLE `Step5` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyLocation` VARCHAR(191) NULL,
    `employeeId` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `from` VARCHAR(191) NULL,
    `to` VARCHAR(191) NULL,
    `salary` VARCHAR(191) NULL,
    `salarySlip` LONGBLOB NULL,
    `relievingLetter` LONGBLOB NULL,
    `experienceLetter` LONGBLOB NULL,
    `reasonForLeaving` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Step5_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step5` ADD CONSTRAINT `Step5_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
