-- CreateTable
CREATE TABLE `Step1` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `notify_candidate` VARCHAR(191) NULL,
    `notify_client` VARCHAR(191) NULL,
    `notify_admin` VARCHAR(191) NULL,
    `form_filled_by` VARCHAR(191) NULL,
    `client_id` VARCHAR(191) NULL,
    `process` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `father_name` VARCHAR(191) NOT NULL,
    `mobile_no` VARCHAR(191) NOT NULL,
    `email_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Step1_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step1` ADD CONSTRAINT `Step1_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
