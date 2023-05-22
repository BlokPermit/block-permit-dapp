-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROJECT_MANAGER', 'OPINION_PROVIDER', 'ADMINISTRATIVE_AUTHORITY');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "address" TEXT NOT NULL,
    "userRole" "UserRole" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
