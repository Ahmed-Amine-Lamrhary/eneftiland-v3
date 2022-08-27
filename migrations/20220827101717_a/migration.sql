-- AlterTable
ALTER TABLE `collection` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `history` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `collectionDesc` VARCHAR(191) NULL,
    MODIFY `collectionName` VARCHAR(191) NULL,
    MODIFY `creators` VARCHAR(65535) NULL,
    MODIFY `externalUrl` VARCHAR(191) NULL,
    MODIFY `network` VARCHAR(191) NULL,
    MODIFY `prefix` VARCHAR(191) NULL,
    MODIFY `royalties` DOUBLE NULL,
    MODIFY `size` INTEGER NULL,
    MODIFY `symbol` VARCHAR(191) NULL;
