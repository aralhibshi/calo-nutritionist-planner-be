/*
  Warnings:

  - You are about to drop the `Component` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ComponentIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealComponent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComponentIngredient" DROP CONSTRAINT "ComponentIngredient_component_id_fkey";

-- DropForeignKey
ALTER TABLE "ComponentIngredient" DROP CONSTRAINT "ComponentIngredient_ingredient_id_fkey";

-- DropForeignKey
ALTER TABLE "MealComponent" DROP CONSTRAINT "MealComponent_component_id_fkey";

-- DropForeignKey
ALTER TABLE "MealComponent" DROP CONSTRAINT "MealComponent_meal_id_fkey";

-- DropTable
DROP TABLE "Component";

-- DropTable
DROP TABLE "ComponentIngredient";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "MealComponent";

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "price" DECIMAL(5,3) NOT NULL,
    "protein" DECIMAL(5,3) NOT NULL,
    "fats" DECIMAL(5,3) NOT NULL,
    "carbs" DECIMAL(5,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "size" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components_ingredients" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "ingredient_quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "components_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals_components" (
    "id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "component_quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "meals_components_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "components_name_key" ON "components"("name");

-- CreateIndex
CREATE UNIQUE INDEX "meals_name_key" ON "meals"("name");

-- AddForeignKey
ALTER TABLE "components_ingredients" ADD CONSTRAINT "components_ingredients_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "components_ingredients" ADD CONSTRAINT "components_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals_components" ADD CONSTRAINT "meals_components_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals_components" ADD CONSTRAINT "meals_components_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
