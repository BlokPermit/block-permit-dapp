/*
  Warnings:

  - You are about to drop the column `investors` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "investors";

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
