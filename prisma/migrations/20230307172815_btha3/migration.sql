/*
  Warnings:

  - Added the required column `user_id` to the `Profession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profession" DROP CONSTRAINT "Profession_id_fkey";

-- AlterTable
ALTER TABLE "Profession" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Profession" ADD CONSTRAINT "Profession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
