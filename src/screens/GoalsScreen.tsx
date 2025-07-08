import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DailyTargets } from '../types';

const GoalsScreen: React.FC = () => {
  const { dailyTargets, updateDailyTargets } = useAppContext();
  
  const [goals, setGoals] = useState<DailyTargets>({
    protein: dailyTargets.protein,
    carbs: dailyTargets.carbs,
    fats: dailyTargets.fats,
    calories: dailyTargets.calories
  });

  const [isEditing, setIsEditing] = useState(false);

  // Format number to display with max 2 decimal places
  const formatNumber = (value: number): string => {
    return value.toFixed(2).replace(/\.?0+$/, '');
  };

  // Calculate calories based on macros (4-4-9 rule)
  const calculateCalories = (protein: number, carbs: number, fats: number) => {
    return parseFloat(((protein * 4) + (carbs * 4) + (fats * 9)).toFixed(2));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setGoals(prev => {
      const newGoals = { ...prev, [name]: numValue };
      
      // Auto-calculate calories when macros change
      if (name !== 'calories') {
        const calculated = calculateCalories(
          name === 'protein' ? numValue : prev.protein,
          name === 'carbs' ? numValue : prev.carbs,
          name === 'fats' ? numValue : prev.fats
        );
        newGoals.calories = calculated;
      }
      
      return newGoals;
    });
  };

  // Save goals
  const handleSave = () => {
    // Ensure all values are formatted to max 2 decimal places before saving
    const formattedGoals = {
      protein: parseFloat(goals.protein.toFixed(2)),
      carbs: parseFloat(goals.carbs.toFixed(2)),
      fats: parseFloat(goals.fats.toFixed(2)),
      calories: Math.round(goals.calories)
    };
    updateDailyTargets(formattedGoals);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setGoals({
      protein: dailyTargets.protein,
      carbs: dailyTargets.carbs,
      fats: dailyTargets.fats,
      calories: dailyTargets.calories
    });
    setIsEditing(false);
  };

  return (
    <div className="goals-screen">
      <div className="goals-card">
        {isEditing ? (
          <div className="goals-form">
            <div className="form-group">
              <label htmlFor="protein">Protein (g):</label>
              <input
                id="protein"
                name="protein"
                type="number"
                min="0"
                step="0.01"
                value={goals.protein}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="carbs">Carbs (g):</label>
              <input
                id="carbs"
                name="carbs"
                type="number"
                min="0"
                step="0.01"
                value={goals.carbs}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fats">Fats (g):</label>
              <input
                id="fats"
                name="fats"
                type="number"
                min="0"
                step="0.01"
                value={goals.fats}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Calories (auto-calculated):</label>
              <div className="calculated-value">{goals.calories} kcal</div>
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={handleCancel}>Cancel</button>
              <button type="button" onClick={handleSave}>Save Goals</button>
            </div>
          </div>
        ) : (
          <div className="goals-display">
            <div className="goals-summary">
              <div className="goal-item">
                <div className="goal-label">Protein</div>
                <div className="goal-value">{formatNumber(dailyTargets.protein)}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Carbs</div>
                <div className="goal-value">{formatNumber(dailyTargets.carbs)}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Fats</div>
                <div className="goal-value">{formatNumber(dailyTargets.fats)}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Calories</div>
                <div className="goal-value">{dailyTargets.calories} kcal</div>
              </div>
            </div>
            
            <button 
              className="edit-goals-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Goals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsScreen; 