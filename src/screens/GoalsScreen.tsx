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
  // const [calculatedCalories, setCalculatedCalories] = useState(0);

  // Calculate calories based on macros (4-4-9 rule)
  const calculateCalories = (protein: number, carbs: number, fats: number) => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    setGoals(prev => {
      const newGoals = { ...prev, [name]: numValue };
      
      // Auto-calculate calories when macros change
      if (name !== 'calories') {
        const calculated = calculateCalories(
          name === 'protein' ? numValue : prev.protein,
          name === 'carbs' ? numValue : prev.carbs,
          name === 'fats' ? numValue : prev.fats
        );
        //setCalculatedCalories(calculated);
        newGoals.calories = calculated;
      }
      
      return newGoals;
    });
  };

  // Save goals
  const handleSave = () => {
    updateDailyTargets(goals);
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
                <div className="goal-value">{dailyTargets.protein}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Carbs</div>
                <div className="goal-value">{dailyTargets.carbs}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Fats</div>
                <div className="goal-value">{dailyTargets.fats}g</div>
              </div>
              
              <div className="goal-item">
                <div className="goal-label">Calories</div>
                <div className="goal-value">{dailyTargets.calories} kcal</div>
              </div>
            </div>
            
            <div className="macro-ratio">
              <h3>Macro Ratio</h3>
              <div className="ratio-bar">
                <div 
                  className="ratio-segment protein" 
                  style={{ 
                    width: `${(dailyTargets.protein * 4 / dailyTargets.calories) * 100}%` 
                  }}
                ></div>
                <div 
                  className="ratio-segment carbs" 
                  style={{ 
                    width: `${(dailyTargets.carbs * 4 / dailyTargets.calories) * 100}%` 
                  }}
                ></div>
                <div 
                  className="ratio-segment fats" 
                  style={{ 
                    width: `${(dailyTargets.fats * 9 / dailyTargets.calories) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="ratio-legend">
                <div className="legend-item">
                  <div className="legend-color protein"></div>
                  <div className="legend-text">Protein {Math.round((dailyTargets.protein * 4 / dailyTargets.calories) * 100)}%</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color carbs"></div>
                  <div className="legend-text">Carbs {Math.round((dailyTargets.carbs * 4 / dailyTargets.calories) * 100)}%</div>
                </div>
                <div className="legend-item">
                  <div className="legend-color fats"></div>
                  <div className="legend-text">Fats {Math.round((dailyTargets.fats * 9 / dailyTargets.calories) * 100)}%</div>
                </div>
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