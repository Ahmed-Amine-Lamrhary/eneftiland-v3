/*
  Warnings:

  - Added the required column `completed` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `collection` MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `galleryLayers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL,
    MODIFY `creators` VARCHAR(65535) NOT NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `completed` BOOLEAN NOT NULL,
    MODIFY `layers` VARCHAR(65535) NOT NULL,
    MODIFY `results` VARCHAR(65535) NOT NULL;
