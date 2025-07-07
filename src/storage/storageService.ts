import { FoodItem, Meal, DailyTargets, DEFAULT_DAILY_TARGETS } from '../types';
import { Store } from '@tauri-apps/plugin-store';

// Initialize storage
export const initializeStorage = async (): Promise<void> => {
  try {
    console.log('Initializing storage with Tauri Store plugin');
    
    // Load or create stores
    const foodsStore = await Store.load('foods.json');
    const mealsStore = await Store.load('meals.json');
    const targetsStore = await Store.load('targets.json');
    
    // Initialize foods if needed
    if (!(await foodsStore.has('foods'))) {
      await foodsStore.set('foods', []);
      await foodsStore.save();
    }
    
    // Initialize meals if needed
    if (!(await mealsStore.has('meals'))) {
      const initialMeals = [
        { name: 'Breakfast', foods: [] },
        { name: 'Lunch', foods: [] },
        { name: 'Dinner', foods: [] },
        { name: 'Snacks', foods: [] },
      ];
      await mealsStore.set('meals', initialMeals);
      await mealsStore.save();
    }
    
    // Initialize daily targets if needed
    if (!(await targetsStore.has('targets'))) {
      await targetsStore.set('targets', DEFAULT_DAILY_TARGETS);
      await targetsStore.save();
    }
    
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Foods database operations
export const getFoods = async (): Promise<FoodItem[]> => {
  try {
    const store = await Store.load('foods.json');
    const foods = await store.get('foods') as FoodItem[];
    return foods || [];
  } catch (error) {
    console.error('Error reading foods:', error);
    return [];
  }
};

export const saveFoods = async (foods: FoodItem[]): Promise<void> => {
  try {
    const store = await Store.load('foods.json');
    await store.set('foods', foods);
    await store.save();
  } catch (error) {
    console.error('Error saving foods:', error);
  }
};

// Today's meals operations
export const getTodayMeals = async (): Promise<Meal[]> => {
  try {
    const store = await Store.load('meals.json');
    const meals = await store.get('meals') as Meal[];
    if (!meals) {
      const initialMeals = [
        { name: 'Breakfast', foods: [] },
        { name: 'Lunch', foods: [] },
        { name: 'Dinner', foods: [] },
        { name: 'Snacks', foods: [] },
      ];
      return initialMeals;
    }
    return meals;
  } catch (error) {
    console.error('Error reading today meals:', error);
    const initialMeals = [
      { name: 'Breakfast', foods: [] },
      { name: 'Lunch', foods: [] },
      { name: 'Dinner', foods: [] },
      { name: 'Snacks', foods: [] },
    ];
    return initialMeals;
  }
};

export const saveTodayMeals = async (meals: Meal[]): Promise<void> => {
  try {
    const store = await Store.load('meals.json');
    await store.set('meals', meals);
    await store.save();
  } catch (error) {
    console.error('Error saving today meals:', error);
  }
};

// Daily targets operations
export const getDailyTargets = async (): Promise<DailyTargets> => {
  try {
    const store = await Store.load('targets.json');
    const targets = await store.get('targets') as DailyTargets;
    return targets || DEFAULT_DAILY_TARGETS;
  } catch (error) {
    console.error('Error reading daily targets:', error);
    return DEFAULT_DAILY_TARGETS;
  }
};

export const saveDailyTargets = async (targets: DailyTargets): Promise<void> => {
  try {
    const store = await Store.load('targets.json');
    await store.set('targets', targets);
    await store.save();
  } catch (error) {
    console.error('Error saving daily targets:', error);
  }
}; 