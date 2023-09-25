import { MealComponent } from '@lib/interfaces/entities';
import { JoinBaseRepo } from './base/joinBaseRepository';

export default class MealComponentRepository extends JoinBaseRepo<MealComponent> {
  private static instance: MealComponentRepository | null = null;

  private constructor() {
    super('MealComponent')
  }

  public static getInstance(): MealComponentRepository {
    if (!MealComponentRepository.instance) {
      MealComponentRepository.instance = new MealComponentRepository();
    }
    return MealComponentRepository.instance;
  }
}