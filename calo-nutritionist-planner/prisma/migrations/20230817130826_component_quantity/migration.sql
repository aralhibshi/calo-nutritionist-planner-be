/*
  Warnings:

  - Added the required column `component_quantity` to the `MealComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MealComponent" ADD COLUMN     "component_quantity" INTEGER NOT NULL;
