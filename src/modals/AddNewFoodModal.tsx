import React, { useState, useEffect } from 'react';
import { FoodItem } from '../types';

interface AddNewFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFood: (food: FoodItem) => void;
  editFood?: FoodItem | null;
}

const AddNewFoodModal: React.FC<AddNewFoodModalProps> = ({
  isOpen,
  onClose,
  onSaveFood,
  editFood = null,
}) => {
  const [food, setFood] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    unit: 'g',
    macroPer: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  // If editing an existing food, populate the form
  useEffect(() => {
    if (editFood) {
      setFood({
        name: editFood.name,
        unit: editFood.unit,
        macroPer: editFood.macroPer,
        protein: editFood.protein,
        carbs: editFood.carbs,
        fats: editFood.fats,
        calories: editFood.calories,
      });
    } else {
      // Reset form when not editing
      setFood({
        name: '',
        unit: 'g',
        macroPer: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
      });
    }
  }, [editFood, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (name !== 'name' && name !== 'unit') {
      // If the field is empty, store 0 in the state but display empty string
      if (value === '') {
        setFood({
          ...food,
          [name]: 0
        });
      } else {
        // Check specifically for "0" input
        if (value === '0') {
          setFood({
            ...food,
            [name]: 0
          });
        } else {
          // Otherwise parse the value as a number
          const parsedValue = parseFloat(value);
          setFood({
            ...food,
            [name]: isNaN(parsedValue) ? 0 : parsedValue
          });
        }
      }
    } else {
      // For non-numeric fields (name, unit)
      setFood({
        ...food,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all numeric fields have values (default to 0 if empty)
    const submissionFood = {
      ...food,
      macroPer: food.macroPer || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fats: food.fats || 0,
      calories: food.calories || 0
    };
    
    // Calculate calories if not manually entered (using the 4-4-9 rule)
    let calculatedCalories = submissionFood.calories;
    if (calculatedCalories === 0) {
      calculatedCalories = (submissionFood.protein * 4) + (submissionFood.carbs * 4) + (submissionFood.fats * 9);
      // Ensure maximum 2 decimal places
      calculatedCalories = parseFloat(calculatedCalories.toFixed(2));
    }
    
    // Ensure all numeric values have maximum 2 decimal places
    const processedFood = {
      id: editFood ? editFood.id : `food-${Date.now()}`,
      name: submissionFood.name,
      unit: submissionFood.unit,
      macroPer: parseFloat(submissionFood.macroPer.toFixed(2)),
      protein: parseFloat(submissionFood.protein.toFixed(2)),
      carbs: parseFloat(submissionFood.carbs.toFixed(2)),
      fats: parseFloat(submissionFood.fats.toFixed(2)),
      calories: parseFloat(calculatedCalories.toFixed(2)),
    };
    
    onSaveFood(processedFood);
    
    onClose();
  };

  // Helper function to display values in inputs
  const displayValue = (value: number) => {
    // If value is 0, display empty string (but allow 0 to be entered)
    if (value === 0) {
      return '';
    }
    // Otherwise return the actual value
    return value;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editFood ? 'Edit Food' : 'Add New Food'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Food Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={food.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="unit">Unit:</label>
              <select
                id="unit"
                name="unit"
                value={food.unit}
                onChange={handleInputChange}
                required
                className="unit-select"
              >
                <option value="g">grams (g)</option>
                <option value="ml">milliliters (ml)</option>
                <option value="serving">serving</option>
                <option value="piece">piece</option>
                <option value="tbsp">tbsp</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="macroPer">Macro Per:</label>
              <input
                id="macroPer"
                name="macroPer"
                type="number"
                min="0"
                step="0.01"
                value={displayValue(food.macroPer)}
                onChange={handleInputChange}
              />
              <span className="input-suffix">{food.unit}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="protein">Protein (g):</label>
            <input
              id="protein"
              name="protein"
              type="number"
              min="0"
              step="0.01"
              value={displayValue(food.protein)}
              onChange={handleInputChange}
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
              value={displayValue(food.carbs)}
              onChange={handleInputChange}
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
              value={displayValue(food.fats)}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="calories">
              Calories (kcal):
            </label>
            <input
              id="calories"
              name="calories"
              type="number"
              min="0"
              step="0.01"
              value={displayValue(food.calories)}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">
              {editFood ? 'Save Changes' : 'Add Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewFoodModal; 