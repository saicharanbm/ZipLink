/*
  Warnings:

  - You are about to drop the column `shortCode` on the `ShortenedURL` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `ShortenedURL` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ShortenedURL` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ShortenedURL_shortCode_key";

-- AlterTable
ALTER TABLE "ShortenedURL" DROP COLUMN "shortCode",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShortenedURL_slug_key" ON "ShortenedURL"("slug");
