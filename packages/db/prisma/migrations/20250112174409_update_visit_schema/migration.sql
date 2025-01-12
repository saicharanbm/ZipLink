/*
  Warnings:

  - You are about to drop the column `shortenedURLId` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `URLSlug` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_shortenedURLId_fkey";

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "shortenedURLId",
ADD COLUMN     "URLSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_URLSlug_fkey" FOREIGN KEY ("URLSlug") REFERENCES "ShortenedURL"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
