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
  - Added the required column `administrativeAuthorityId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectManagerId` to the `Project` table without a default value. This is not possible if the table is not empty.
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
ADD COLUMN     "administrativeAuthorityId" INTEGER NOT NULL,
ADD COLUMN     "documentUrls" TEXT[],
ADD COLUMN     "projectManagerId" INTEGER NOT NULL,
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
CREATE TABLE "Opinion" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER,
    "opinion" TEXT NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "Opinion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectManager" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProjectManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpinionProvider" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OpinionProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdministrativeAuthority" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AdministrativeAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "investorId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectManager_userId_key" ON "ProjectManager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OpinionProvider_userId_key" ON "OpinionProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdministrativeAuthority_userId_key" ON "AdministrativeAuthority"("userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_projectManagerId_fkey" FOREIGN KEY ("projectManagerId") REFERENCES "ProjectManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_administrativeAuthorityId_fkey" FOREIGN KEY ("administrativeAuthorityId") REFERENCES "AdministrativeAuthority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opinion" ADD CONSTRAINT "Opinion_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "OpinionProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectManager" ADD CONSTRAINT "ProjectManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpinionProvider" ADD CONSTRAINT "OpinionProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdministrativeAuthority" ADD CONSTRAINT "AdministrativeAuthority_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "Investor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
