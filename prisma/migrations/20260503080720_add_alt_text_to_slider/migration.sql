/*
  Warnings:

  - You are about to drop the column `buttonText` on the `Slider` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Slider` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Slider` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Slider" DROP COLUMN "buttonText",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "altText" TEXT;
