/*
  Warnings:

  - The `images` column on the `Profession` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dates_times` column on the `Profession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Profession" DROP COLUMN "images",
ADD COLUMN     "images" JSONB,
ALTER COLUMN "ratings" DROP NOT NULL,
DROP COLUMN "dates_times",
ADD COLUMN     "dates_times" JSONB;
