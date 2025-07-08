import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AddFoodModal from '../modals/AddFoodModal';
import ResetDayModal from '../modals/ResetDayModal';

const HomeScreen: React.FC = () => {
  const { 
    meals, 
    dailyTargets,
    isAddFoodModalOpen,
    setIsAddFoodModalOpen,
    currentMealIndex,
    setCurrentMealIndex,
    addFoodToMeal,
    removeFoodFromMeal,
    resetDay,
    foods
  } = useAppContext();
  
  const [isResetDayModalOpen, setIsResetDayModalOpen] = useState(false);

  // Format number to display with max 2 decimal places
  const formatNumber = (value: number): string => {
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  // Calculate total macros for the day
  const dailyTotals = React.useMemo(() => {
    const totals = meals.reduce(
      (acc, meal) => {
        meal.foods.forEach((food) => {
          acc.protein += food.protein;
          acc.carbs += food.carbs;
          acc.fats += food.fats;
          acc.calories += food.calories;
        });
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0, calories: 0 }
    );
    
    // Format all values to have max 2 decimal places
    return {
      protein: parseFloat(totals.protein.toFixed(2)),
      carbs: parseFloat(totals.carbs.toFixed(2)),
      fats: parseFloat(totals.fats.toFixed(2)),
      calories: Math.round(totals.calories)
    };
  }, [meals]);

  // Calculate total macros for each meal
  const getMealTotals = (mealIndex: number) => {
    const totals = meals[mealIndex].foods.reduce(
      (acc, food) => {
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
        acc.calories += food.calories;
        return acc;
      },
      { protein: 0, carbs: 0, fats: 0, calories: 0 }
    );
    
    // Format all values to have max 2 decimal places
    return {
      protein: parseFloat(totals.protein.toFixed(2)),
      carbs: parseFloat(totals.carbs.toFixed(2)),
      fats: parseFloat(totals.fats.toFixed(2)),
      calories: Math.round(totals.calories)
    };
  };

  // Calculate percentage for progress bars
  const getPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Handler for adding food to a meal
  const handleAddFood = (mealIndex: number) => {
    setCurrentMealIndex(mealIndex);
    setIsAddFoodModalOpen(true);
  };

  // Handler for removing food from a meal
  const handleRemoveFood = (mealIndex: number, foodEntryId: string) => {
    removeFoodFromMeal(mealIndex, foodEntryId);
  };

  // Handler for resetting the day with confirmation
  const handleResetDay = () => {
    console.log("Reset Day button clicked");
    setIsResetDayModalOpen(true);
  };
  
  const handleConfirmReset = () => {
    console.log("User confirmed reset");
    resetDay();
    console.log("resetDay function called");
  };

  return (
    <div className="home-screen">
      <div className="daily-summary">
        <div className="daily-summary-header">
          <h2>Today's Progress</h2>
          <div className="daily-calories">
            <div className="daily-calories-value">{dailyTotals.calories}</div>
            <div className="daily-calories-info">
              <div className="daily-calories-label">kcal</div>
              <div className="daily-calories-target">of {dailyTargets.calories}</div>
            </div>
          </div>
        </div>
        
        <div className="macro-progress">
          <div className="macro-item">
            <div className="macro-label">
              <div className="macro-name">
                <span>Protein</span>
              </div>
              <span className="macro-values">
                <span className="macro-current">{formatNumber(dailyTotals.protein)}g</span>
                <span className="macro-separator">/</span>
                <span className="macro-target">{formatNumber(dailyTargets.protein)}g</span>
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar protein"
                style={{ width: `${getPercentage(dailyTotals.protein, dailyTargets.protein)}%` }}
              >
              </div>
            </div>
          </div>
          
          <div className="macro-item">
            <div className="macro-label">
              <div className="macro-name">
                <span>Carbs</span>
              </div>
              <span className="macro-values">
                <span className="macro-current">{formatNumber(dailyTotals.carbs)}g</span>
                <span className="macro-separator">/</span>
                <span className="macro-target">{formatNumber(dailyTargets.carbs)}g</span>
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar carbs"
                style={{ width: `${getPercentage(dailyTotals.carbs, dailyTargets.carbs)}%` }}
              >
              </div>
            </div>
          </div>
          
          <div className="macro-item">
            <div className="macro-label">
              <div className="macro-name">
                <span>Fats</span>
              </div>
              <span className="macro-values">
                <span className="macro-current">{formatNumber(dailyTotals.fats)}g</span>
                <span className="macro-separator">/</span>
                <span className="macro-target">{formatNumber(dailyTargets.fats)}g</span>
              </span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar fats"
                style={{ width: `${getPercentage(dailyTotals.fats, dailyTargets.fats)}%` }}
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="meals-container">
        <h2>Meals</h2>
        {meals.map((meal, mealIndex) => {
          const mealTotals = getMealTotals(mealIndex);
          // const totalMacros = mealTotals.carbs + mealTotals.protein + mealTotals.fats;
          
          return (
            <div key={meal.name} className="meal-card">
              {/* 1. Section Title */}
              <h3 className="meal-title">{meal.name}</h3>
              
              {/* 3. Food Items List */}
              {meal.foods.length === 0 ? (
                <p className="no-foods">No foods added yet</p>
              ) : (
                <div className="food-items-list">
                  {/* Food entries */}
                  {meal.foods.map((food) => (
                    <div key={food.id} className="food-item">
                      {/* First row: Food name and calories */}
                      <div className="food-row">
                        <div className="food-name">{food.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="food-calories">{food.calories} kcal</div>
                          <button 
                            className="remove-food-button"
                            onClick={() => handleRemoveFood(mealIndex, food.id)}
                            aria-label="Remove food"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      
                      {/* Second row: Quantity and macros */}
                      <div className="food-row second-row">
                        <div className="food-quantity">{formatNumber(food.quantity)} {food.unit}</div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="food-macros">
                            <span className="macro protein">P: {formatNumber(food.protein)}g</span>
                            <span className="macro carbs">C: {formatNumber(food.carbs)}g</span>
                            <span className="macro fats">F: {formatNumber(food.fats)}g</span>
                          </div>
                          <div style={{ width: '2.5rem' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 4. Bottom Totals Row */}
                  {meal.foods.length > 0 && (
                    <div className="meal-totals">
                      <div className="total-column">
                        <div className="total-number protein">{formatNumber(mealTotals.protein)}g</div>
                        <div className="total-label">Protein</div>
                      </div>
                      <div className="total-column">
                        <div className="total-number carbs">{formatNumber(mealTotals.carbs)}g</div>
                        <div className="total-label">Carbohydrate</div>
                      </div>
                      <div className="total-column">
                        <div className="total-number fats">{formatNumber(mealTotals.fats)}g</div>
                        <div className="total-label">Fat</div>
                      </div>
                      <div className="total-column">
                        <div className="total-number calories">{mealTotals.calories} kcal</div>
                        <div className="total-label">Calories</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 5. Add Food Button */}
              <button 
                className="add-food-button"
                onClick={() => handleAddFood(mealIndex)}
              >
                Add food
              </button>
            </div>
          );
        })}
      </div>

      <button className="reset-button" onClick={handleResetDay}>
        Reset Day
      </button>

      {isAddFoodModalOpen && currentMealIndex !== null && (
        <AddFoodModal
          isOpen={isAddFoodModalOpen}
          onClose={() => {
            setIsAddFoodModalOpen(false);
            setCurrentMealIndex(null);
          }}
          mealName={meals[currentMealIndex].name}
          onAddFood={(foodEntry) => {
            addFoodToMeal(currentMealIndex, foodEntry);
            setIsAddFoodModalOpen(false);
            setCurrentMealIndex(null);
          }}
          foods={foods}
        />
      )}
      
      <ResetDayModal
        isOpen={isResetDayModalOpen}
        onClose={() => setIsResetDayModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

export default HomeScreen; 