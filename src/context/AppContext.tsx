import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, FoodEntry, Meal, DEFAULT_DAILY_TARGETS, DailyTargets } from '../types';
import { 
  initializeStorage, 
  getFoods, 
  saveFoods, 
  getTodayMeals, 
  saveTodayMeals,
  getDailyTargets,
  saveDailyTargets
} from '../storage/storageService';

interface AppContextType {
  // Foods database
  foods: FoodItem[];
  addFood: (food: FoodItem) => void;
  updateFood: (food: FoodItem) => void;
  deleteFood: (foodId: string) => void;
  
  // Meals for today
  meals: Meal[];
  addFoodToMeal: (mealIndex: number, foodEntry: FoodEntry) => void;
  removeFoodFromMeal: (mealIndex: number, foodEntryId: string) => void;
  resetDay: () => void;
  
  // Daily targets
  dailyTargets: DailyTargets;
  updateDailyTargets: (targets: DailyTargets) => void;
  
  // Modals
  isAddFoodModalOpen: boolean;
  setIsAddFoodModalOpen: (isOpen: boolean) => void;
  currentMealIndex: number | null;
  setCurrentMealIndex: (index: number | null) => void;
  
  isAddNewFoodModalOpen: boolean;
  setIsAddNewFoodModalOpen: (isOpen: boolean) => void;
  foodToEdit: FoodItem | null;
  setFoodToEdit: (food: FoodItem | null) => void;
  
  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial meals structure
const initialMeals: Meal[] = [
  { name: 'Breakfast', foods: [] },
  { name: 'Lunch', foods: [] },
  { name: 'Dinner', foods: [] },
  { name: 'Snacks', foods: [] },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Foods database state
  const [foods, setFoods] = useState<FoodItem[]>([]);
  
  // Meals state
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  
  // Daily targets
  const [dailyTargets, setDailyTargets] = useState<DailyTargets>(DEFAULT_DAILY_TARGETS);
  
  // Modal states
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [currentMealIndex, setCurrentMealIndex] = useState<number | null>(null);
  
  const [isAddNewFoodModalOpen, setIsAddNewFoodModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);
  
  // Initialize storage and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize storage
        await initializeStorage();
        
        // Load foods
        const savedFoods = await getFoods();
        if (savedFoods && savedFoods.length > 0) {
          setFoods(savedFoods);
        }
        
        // Load meals
        const savedMeals = await getTodayMeals();
        if (savedMeals) {
          try {
            // Check if the saved meals structure matches our new structure
            if (savedMeals.length === 4 && 
                savedMeals[0].name === 'Breakfast' && 
                savedMeals[1].name === 'Lunch' && 
                savedMeals[2].name === 'Dinner' && 
                savedMeals[3].name === 'Snacks') {
              setMeals(savedMeals);
            } else {
              // If structure doesn't match, migrate the food entries to the new structure
              const newMeals = [...initialMeals];
              
              // Function to find the appropriate meal index in the new structure
              const getMealIndexInNewStructure = (oldMealName: string): number => {
                if (oldMealName.includes('Breakfast')) return 0;
                if (oldMealName.includes('Lunch')) return 1;
                if (oldMealName.includes('Dinner')) return 2;
                return 3; // All other meals (including Snacks) go to the Snacks category
              };
              
              // Migrate food entries to the new structure
              savedMeals.forEach((oldMeal: Meal) => {
                if (oldMeal.foods.length > 0) {
                  const newIndex = getMealIndexInNewStructure(oldMeal.name);
                  newMeals[newIndex].foods = [...newMeals[newIndex].foods, ...oldMeal.foods];
                }
              });
              
              setMeals(newMeals);
              // Save the new structure immediately
              await saveTodayMeals(newMeals);
            }
          } catch (error) {
            console.error('Error parsing saved meals:', error);
            setMeals(initialMeals);
          }
        }
        
        // Load daily targets
        const savedTargets = await getDailyTargets();
        if (savedTargets) {
          setDailyTargets(savedTargets);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Mark loading as complete
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save foods whenever they change, but only after initial loading is complete
  useEffect(() => {
    if (!isLoading) {
      saveFoods(foods).catch(error => {
        console.error('Error saving foods:', error);
      });
    }
  }, [foods, isLoading]);
  
  // Save meals whenever they change, but only after initial loading is complete
  useEffect(() => {
    if (!isLoading) {
      saveTodayMeals(meals).catch(error => {
        console.error('Error saving meals:', error);
      });
    }
  }, [meals, isLoading]);
  
  // Save daily targets whenever they change, but only after initial loading is complete
  useEffect(() => {
    if (!isLoading) {
      saveDailyTargets(dailyTargets).catch(error => {
        console.error('Error saving daily targets:', error);
      });
    }
  }, [dailyTargets, isLoading]);
  
  // Food CRUD operations
  const addFood = (food: FoodItem) => {
    setFoods([...foods, food]);
  };
  
  const updateFood = (updatedFood: FoodItem) => {
    setFoods(foods.map(food => food.id === updatedFood.id ? updatedFood : food));
  };
  
  const deleteFood = (foodId: string) => {
    console.log('Delete function called with ID:', foodId);
    
    // Direct approach: filter out the food with the given ID
    const newFoods = foods.filter(food => food.id !== foodId);
    
    // Update state
    setFoods(newFoods);
    
    console.log('Food deleted');
  };
  
  // Meal operations
  const addFoodToMeal = (mealIndex: number, foodEntry: FoodEntry) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods.push(foodEntry);
    setMeals(newMeals);
  };
  
  const removeFoodFromMeal = (mealIndex: number, foodEntryId: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods = newMeals[mealIndex].foods.filter(
      food => food.id !== foodEntryId
    );
    setMeals(newMeals);
  };
  
  const resetDay = async () => {
    console.log("resetDay function in AppContext called");
    // Create a deep copy of initialMeals to ensure a proper reset
    const freshMeals = initialMeals.map(meal => ({
      name: meal.name,
      foods: []
    }));
    console.log("freshMeals created:", freshMeals);
    setMeals(freshMeals);
    console.log("setMeals called with freshMeals");
    
    // Force file update
    await saveTodayMeals(freshMeals);
    console.log("meals file updated directly");
  };
  
  // Update daily targets
  const updateDailyTargets = (targets: DailyTargets) => {
    setDailyTargets(targets);
  };
  
  return (
    <AppContext.Provider
      value={{
        foods,
        addFood,
        updateFood,
        deleteFood,
        
        meals,
        addFoodToMeal,
        removeFoodFromMeal,
        resetDay,
        
        dailyTargets,
        updateDailyTargets,
        
        isAddFoodModalOpen,
        setIsAddFoodModalOpen,
        currentMealIndex,
        setCurrentMealIndex,
        
        isAddNewFoodModalOpen,
        setIsAddNewFoodModalOpen,
        foodToEdit,
        setFoodToEdit,
        
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 