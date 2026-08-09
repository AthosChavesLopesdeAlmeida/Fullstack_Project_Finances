/*
  Warnings:

  - A unique constraint covering the columns `[acc_id,budget_name]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_acc_id_budget_name_key" ON "Budget"("acc_id", "budget_name");
