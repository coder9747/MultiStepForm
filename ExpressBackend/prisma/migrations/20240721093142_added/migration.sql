-- CreateTable
CREATE TABLE `Step4` (
    `id` VARCHAR(191) NOT NULL,
    `userid` VARCHAR(191) NOT NULL,
    `ref_name` VARCHAR(191) NULL,
    `ref_designation` VARCHAR(191) NULL,
    `company_name` VARCHAR(191) NULL,
    `ref_contact_num` VARCHAR(191) NULL,
    `ref_email` VARCHAR(191) NULL,
    `ref_relationship` VARCHAR(191) NULL,

    UNIQUE INDEX `Step4_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Step4` ADD CONSTRAINT `Step4_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
