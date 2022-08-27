/*
  Warnings:

  - Added the required column `collectionDesc` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionName` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creators` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalUrl` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `network` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefix` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `royalties` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `collection` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `collectionDesc` VARCHAR(191) NOT NULL,
    ADD COLUMN `collectionName` VARCHAR(191) NOT NULL,
    ADD COLUMN `creators` VARCHAR(65535) NOT NULL,
    ADD COLUMN `externalUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `network` VARCHAR(191) NOT NULL,
    ADD COLUMN `prefix` VARCHAR(191) NOT NULL,
    ADD COLUMN `royalties` DOUBLE NOT NULL,
    ADD COLUMN `size` INTEGER NOT NULL,
    ADD COLUMN `symbol` VARCHAR(191) NOT NULL,
    MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL;
