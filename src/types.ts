export interface FoodItem {
  id: string;
  name: string;
  unit: string;
  macroPer: number;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface Meal {
  name: string;
  foods: FoodEntry[];
}

export interface DailyTargets {
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
}

export const DEFAULT_DAILY_TARGETS: DailyTargets = {
  protein: 96,
  carbs: 240,
  fats: 64,
  calories: 1918,
}; 