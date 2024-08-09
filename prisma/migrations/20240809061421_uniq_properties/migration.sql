/*
  Warnings:

  - You are about to drop the column `mboys_amount` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bnbAddress]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tonAddress]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mboysAmount` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "mboys_amount",
ADD COLUMN     "mboysAmount" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_bnbAddress_key" ON "Post"("bnbAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Post_tonAddress_key" ON "Post"("tonAddress");
