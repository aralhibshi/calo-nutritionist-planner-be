/*
  Warnings:

  - You are about to alter the column `protein` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,3)` to `Decimal(4,3)`.
  - You are about to alter the column `fats` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,3)` to `Decimal(4,3)`.
  - You are about to alter the column `carbs` on the `ingredients` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,3)` to `Decimal(4,3)`.

*/
-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "price" SET DATA TYPE DECIMAL(6,3),
ALTER COLUMN "protein" SET DATA TYPE DECIMAL(4,3),
ALTER COLUMN "fats" SET DATA TYPE DECIMAL(4,3),
ALTER COLUMN "carbs" SET DATA TYPE DECIMAL(4,3);
