/*
  Warnings:

  - The values [TRACK] on the enum `ChoiceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChoiceType_new" AS ENUM ('GENRE', 'ARTIST', 'SONG', 'ALBUM');
ALTER TABLE "Choice" ALTER COLUMN "type" TYPE "ChoiceType_new" USING ("type"::text::"ChoiceType_new");
ALTER TYPE "ChoiceType" RENAME TO "ChoiceType_old";
ALTER TYPE "ChoiceType_new" RENAME TO "ChoiceType";
DROP TYPE "ChoiceType_old";
COMMIT;
