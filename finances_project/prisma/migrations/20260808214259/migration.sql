/*
  Warnings:

  - Added the required column `budget_name` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "budget_name" TEXT NOT NULL;
