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
        // Otherwise parse the value as a number
        setFood({
          ...food,
          [name]: parseFloat(value) || 0
        });
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
    
    // Calculate calories if not manually entered (using the 4-4-9 rule)
    let calculatedCalories = food.calories;
    if (calculatedCalories === 0) {
      calculatedCalories = (food.protein * 4) + (food.carbs * 4) + (food.fats * 9);
    }
    
    onSaveFood({
      id: editFood ? editFood.id : `food-${Date.now()}`,
      ...food,
      calories: calculatedCalories,
    });
    
    onClose();
  };

  // Helper function to display values in inputs
  const displayValue = (value: number) => {
    // If editing or value is not 0, display the value
    if (editFood || value !== 0) {
      return value;
    }
    // Otherwise return empty string
    return '';
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
                <option value="oz">ounces (oz)</option>
                <option value="piece">piece</option>
                <option value="serving">serving</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="macroPer">Macro Per:</label>
              <input
                id="macroPer"
                name="macroPer"
                type="number"
                min="0"
                step="1"
                value={displayValue(food.macroPer)}
                onChange={handleInputChange}
                required
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
              step="0.1"
              value={displayValue(food.protein)}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="carbs">Carbs (g):</label>
            <input
              id="carbs"
              name="carbs"
              type="number"
              min="0"
              step="0.1"
              value={displayValue(food.carbs)}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fats">Fats (g):</label>
            <input
              id="fats"
              name="fats"
              type="number"
              min="0"
              step="0.1"
              value={displayValue(food.fats)}
              onChange={handleInputChange}
              required
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
              step="1"
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