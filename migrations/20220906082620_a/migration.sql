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
ALTER TABLE `redumption` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `termspage` MODIFY `content` VARCHAR(65535) NOT NULL;

-- CreateTable
CREATE TABLE `collaborations` (
    `id` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `collectionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `redumption` ADD CONSTRAINT `redumption_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collaborations` ADD CONSTRAINT `collaborations_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
