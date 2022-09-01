-- DropForeignKey
ALTER TABLE `collectionshare` DROP FOREIGN KEY `collectionshare_collectionId_fkey`;

-- AlterTable
ALTER TABLE `collection` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `collectionshare` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `plan` MODIFY `features` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `privacypage` MODIFY `content` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `termspage` MODIFY `content` VARCHAR(65535) NOT NULL;

-- AddForeignKey
ALTER TABLE `collectionshare` ADD CONSTRAINT `collectionshare_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
