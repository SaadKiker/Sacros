import React, { useState, useEffect } from 'react';
import { FoodItem, FoodEntry } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealName: string;
  onAddFood: (foodEntry: FoodEntry) => void;
  foods: FoodItem[];
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  mealName,
  onAddFood,
  foods,
}) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [calculatedMacros, setCalculatedMacros] = useState({
    protein: 0,
    carbs: 0,
    fats: 0,
    calories: 0,
  });

  const selectedFood = foods.find(food => food.id === selectedFoodId);
  
  // Filter foods based on search query
  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate macros whenever selected food or quantity changes
  useEffect(() => {
    if (selectedFood) {
      const ratio = (quantity || 0) / selectedFood.macroPer;
      setCalculatedMacros({
        protein: parseFloat((selectedFood.protein * ratio).toFixed(2)),
        carbs: parseFloat((selectedFood.carbs * ratio).toFixed(2)),
        fats: parseFloat((selectedFood.fats * ratio).toFixed(2)),
        calories: Math.round(selectedFood.calories * ratio),
      });
    } else {
      setCalculatedMacros({
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
      });
    }
  }, [selectedFoodId, quantity, foods]);

  // Reset search when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedFoodId('');
      setQuantity(0);
      setIsSearching(false);
    }
  }, [isOpen]);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // If the field is empty, store 0 in the state but display empty string
    if (value === '') {
      setQuantity(0);
    } else if (value === '0') {
      // Explicitly handle "0" input
      setQuantity(0);
    } else {
      // Otherwise parse the value as a number
      const parsedValue = parseFloat(value);
      setQuantity(isNaN(parsedValue) ? 0 : parsedValue);
    }
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

  const handleFoodSelect = (foodId: string) => {
    setSelectedFoodId(foodId);
    // Find the selected food name to update search query
    const food = foods.find(f => f.id === foodId);
    if (food) {
      setSearchQuery(food.name);
    }
    // Hide search results after selection
    setIsSearching(false);
  };

  const handleSearchFocus = () => {
    setIsSearching(true);
    // If there's already a selection, clear it to allow for new search
    if (selectedFoodId) {
      // Keep the search query but allow searching again
      setIsSearching(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
    
    // Clear selection if search is cleared or changed significantly
    if (!value || (selectedFoodId && !selectedFood?.name.toLowerCase().includes(value.toLowerCase()))) {
      setSelectedFoodId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFood) {
      // Ensure quantity is at least 0
      const finalQuantity = quantity || 0;
      
      onAddFood({
        id: `${selectedFoodId}-${Date.now()}`,
        name: selectedFood.name,
        quantity: parseFloat(finalQuantity.toFixed(2)),
        unit: selectedFood.unit,
        protein: parseFloat(calculatedMacros.protein.toFixed(2)),
        carbs: parseFloat(calculatedMacros.carbs.toFixed(2)),
        fats: parseFloat(calculatedMacros.fats.toFixed(2)),
        calories: calculatedMacros.calories,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Food to {mealName}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${isSearching && searchQuery ? 'with-results' : ''}`}>
            <label htmlFor="food-search">Search Food:</label>
            <input
              id="food-search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={() => {
                // Small delay to allow click events on search results
                setTimeout(() => {
                  if (!selectedFoodId) {
                    setIsSearching(false);
                  }
                }, 200);
              }}
              placeholder="Type to search foods..."
              autoComplete="off"
            />
          </div>
          
          {isSearching && searchQuery && (
            <div className="search-results">
              {filteredFoods.length > 0 ? (
                <ul className="food-search-list">
                  {filteredFoods.map((food) => (
                    <li 
                      key={food.id} 
                      className={`food-search-item ${selectedFoodId === food.id ? 'selected' : ''}`}
                      onClick={() => handleFoodSelect(food.id)}
                    >
                      {food.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-results">No foods found</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity ({selectedFood ? selectedFood.unit : 'units'}):
            </label>
            <input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              value={displayValue(quantity)}
              onChange={handleQuantityChange}
            />
          </div>

          {selectedFood && (
            <div className="calculated-macros">
              <h3>Calculated Macros:</h3>
              <p>Protein: {calculatedMacros.protein}g</p>
              <p>Carbs: {calculatedMacros.carbs}g</p>
              <p>Fats: {calculatedMacros.fats}g</p>
              <p>Calories: {calculatedMacros.calories} kcal</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              disabled={!selectedFoodId}
            >
              Add to Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal; 