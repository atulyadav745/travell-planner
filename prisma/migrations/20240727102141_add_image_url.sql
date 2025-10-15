/*
  Warnings:
  - Added the required column `imageUrl` to the `Activity` table without a default value
*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN "imageUrl" TEXT;