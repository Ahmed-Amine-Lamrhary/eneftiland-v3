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
ALTER TABLE `settings` ADD COLUMN `isBeta` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `termspage` MODIFY `content` VARCHAR(65535) NOT NULL;
