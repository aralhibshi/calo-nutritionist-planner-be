import { ComponentIngredient } from '@lib/interfaces/entities';
import { JoinBaseRepo } from './base/joinBaseRepository';

export default class ComponentIngredientRepository extends JoinBaseRepo<ComponentIngredient> {
  private static instance: ComponentIngredientRepository | null = null;

  private constructor() {
    super('ComponentIngredient')
  }

  public static getInstance(): ComponentIngredientRepository {
    if (!ComponentIngredientRepository.instance) {
      ComponentIngredientRepository.instance = new ComponentIngredientRepository();
    }
    return ComponentIngredientRepository.instance;
  }
}