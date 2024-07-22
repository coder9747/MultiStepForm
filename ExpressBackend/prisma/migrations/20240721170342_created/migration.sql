-- CreateTable
CREATE TABLE `Step6` (
    `id` VARCHAR(191) NOT NULL,
    `course_name` VARCHAR(191) NULL,
    `heighest_qualify` VARCHAR(191) NULL,
    `university_name` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `duration_start` VARCHAR(191) NULL,
    `duration_end` VARCHAR(191) NULL,
    `passing_year` VARCHAR(191) NULL,
    `gpa_percentage` VARCHAR(191) NULL,
    `roll_number` VARCHAR(191) NULL,
    `certificate_number` VARCHAR(191) NULL,
    `certificate` LONGBLOB NULL,
    `certificateMimeType` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Step6_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step6` ADD CONSTRAINT `Step6_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
