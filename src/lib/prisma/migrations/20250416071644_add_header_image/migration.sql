/*
  Warnings:

  - You are about to drop the column `pronouns` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pronouns",
ADD COLUMN     "headerImage" TEXT;
