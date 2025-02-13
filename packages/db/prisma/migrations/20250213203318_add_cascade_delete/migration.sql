-- DropForeignKey
ALTER TABLE "ShortenedURL" DROP CONSTRAINT "ShortenedURL_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_URLSlug_fkey";

-- AddForeignKey
ALTER TABLE "ShortenedURL" ADD CONSTRAINT "ShortenedURL_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_URLSlug_fkey" FOREIGN KEY ("URLSlug") REFERENCES "ShortenedURL"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
