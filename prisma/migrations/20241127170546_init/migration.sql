-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderLink" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "store" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
