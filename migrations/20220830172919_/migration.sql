/*
  Warnings:

  - You are about to drop the column `metamaskAddress` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `collection` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `plan` MODIFY `features` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `privacypage` MODIFY `content` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `termspage` MODIFY `content` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `metamaskAddress`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
