import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, FoodEntry, Meal, DEFAULT_DAILY_TARGETS, DailyTargets } from '../types';

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

  // Load foods from localStorage on initial render
  useEffect(() => {
    const savedFoods = localStorage.getItem('sacros-foods');
    if (savedFoods) {
      setFoods(JSON.parse(savedFoods));
    }
    
    const savedMeals = localStorage.getItem('sacros-today-meals');
    if (savedMeals) {
      try {
        const parsedMeals = JSON.parse(savedMeals);
        
        // Check if the saved meals structure matches our new structure
        if (parsedMeals.length === 4 && 
            parsedMeals[0].name === 'Breakfast' && 
            parsedMeals[1].name === 'Lunch' && 
            parsedMeals[2].name === 'Dinner' && 
            parsedMeals[3].name === 'Snacks') {
          setMeals(parsedMeals);
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
          parsedMeals.forEach((oldMeal: Meal) => {
            if (oldMeal.foods.length > 0) {
              const newIndex = getMealIndexInNewStructure(oldMeal.name);
              newMeals[newIndex].foods = [...newMeals[newIndex].foods, ...oldMeal.foods];
            }
          });
          
          setMeals(newMeals);
          // Save the new structure immediately
          localStorage.setItem('sacros-today-meals', JSON.stringify(newMeals));
        }
      } catch (error) {
        console.error('Error parsing saved meals:', error);
        setMeals(initialMeals);
      }
    }
    
    const savedTargets = localStorage.getItem('sacros-daily-targets');
    if (savedTargets) {
      setDailyTargets(JSON.parse(savedTargets));
    }
  }, []);
  
  // Save foods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sacros-foods', JSON.stringify(foods));
  }, [foods]);
  
  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sacros-today-meals', JSON.stringify(meals));
  }, [meals]);
  
  // Save daily targets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sacros-daily-targets', JSON.stringify(dailyTargets));
  }, [dailyTargets]);
  
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
    
    // Save to localStorage
    localStorage.setItem('sacros-foods', JSON.stringify(newFoods));
    
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
  
  const resetDay = () => {
    console.log("resetDay function in AppContext called");
    // Create a deep copy of initialMeals to ensure a proper reset
    const freshMeals = initialMeals.map(meal => ({
      name: meal.name,
      foods: []
    }));
    console.log("freshMeals created:", freshMeals);
    setMeals(freshMeals);
    console.log("setMeals called with freshMeals");
    
    // Force localStorage update
    localStorage.setItem('sacros-today-meals', JSON.stringify(freshMeals));
    console.log("localStorage updated directly");
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