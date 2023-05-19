-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "legalBodyName" TEXT NOT NULL,
    "legalBodyAddress" TEXT NOT NULL,
    "constructionTitle" TEXT NOT NULL,
    "constructionImpactsEnvironment" BOOLEAN NOT NULL,
    "constructionType" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "Investor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investor" ADD CONSTRAINT "Investor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
