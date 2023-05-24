/*
  Warnings:

  - You are about to drop the column `address` on the `Investor` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Investor` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `documentUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `legalBodyAddress` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `legalBodyName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `User` table. All the data in the column will be lost.
  - Added the required column `streetAddress` to the `Investor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smartContractAddress` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Investor" DROP CONSTRAINT "Investor_projectId_fkey";

-- AlterTable
ALTER TABLE "Investor" DROP COLUMN "address",
DROP COLUMN "projectId",
ADD COLUMN     "streetAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
DROP COLUMN "documentUrl",
DROP COLUMN "legalBodyAddress",
DROP COLUMN "legalBodyName",
ADD COLUMN     "documentUrls" TEXT[],
ADD COLUMN     "smartContractAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "userRole",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "streetAddress" TEXT NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "investorId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
