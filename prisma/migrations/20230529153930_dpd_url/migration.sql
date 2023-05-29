/*
  Warnings:

  - You are about to drop the column `documentUrls` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "documentUrls",
ADD COLUMN     "dpdUrl" TEXT;
