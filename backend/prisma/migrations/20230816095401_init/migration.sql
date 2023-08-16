-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" TEXT DEFAULT 'No Category',
    "description" TEXT,
    "price" DECIMAL(5,3) NOT NULL,
    "calories" DECIMAL(5,3) NOT NULL,
    "protein" DECIMAL(5,3) NOT NULL,
    "fats" DECIMAL(5,3) NOT NULL,
    "carbs" DECIMAL(5,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" TEXT,
    "size" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentIngredient" (
    "id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "ingredient_quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealComponent" (
    "id" TEXT NOT NULL,
    "meal_id" TEXT NOT NULL,
    "component_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE INDEX "Ingredient_name_idx" ON "Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE INDEX "Component_name_idx" ON "Component"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Meal_name_key" ON "Meal"("name");

-- CreateIndex
CREATE INDEX "Meal_name_idx" ON "Meal"("name");

-- AddForeignKey
ALTER TABLE "ComponentIngredient" ADD CONSTRAINT "ComponentIngredient_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentIngredient" ADD CONSTRAINT "ComponentIngredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealComponent" ADD CONSTRAINT "MealComponent_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealComponent" ADD CONSTRAINT "MealComponent_component_id_fkey" FOREIGN KEY ("component_id") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
