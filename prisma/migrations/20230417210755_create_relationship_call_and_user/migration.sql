/*
  Warnings:

  - You are about to drop the column `client_id` on the `calls` table. All the data in the column will be lost.
  - Added the required column `client` to the `calls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `calls` DROP FOREIGN KEY `calls_client_id_fkey`;

-- AlterTable
ALTER TABLE `calls` DROP COLUMN `client_id`,
    ADD COLUMN `client` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `calls` ADD CONSTRAINT `calls_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
