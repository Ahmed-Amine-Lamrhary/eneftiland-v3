/*
  Warnings:

  - You are about to drop the `history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `history_collectionId_fkey`;

-- AlterTable
ALTER TABLE `collection` ADD COLUMN `collectionId` VARCHAR(191) NULL,
    ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `imagesCid` VARCHAR(191) NULL,
    ADD COLUMN `ipfsGateway` VARCHAR(191) NULL,
    ADD COLUMN `isHistory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `metaCid` VARCHAR(191) NULL,
    MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- DropTable
DROP TABLE `history`;
