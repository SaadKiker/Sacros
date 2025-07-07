import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AddNewFoodModal from '../modals/AddNewFoodModal';
import { FoodItem } from '../types';

const FoodDatabaseScreen: React.FC = () => {
  const {
    foods,
    addFood,
    updateFood,
    deleteFood,
    isAddNewFoodModalOpen,
    setIsAddNewFoodModalOpen,
    foodToEdit,
    setFoodToEdit
  } = useAppContext();

  const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handler for adding a new food
  const handleAddNewFood = () => {
    setFoodToEdit(null);
    setIsAddNewFoodModalOpen(true);
  };

  // Handler for editing a food
  const handleEditFood = (food: FoodItem) => {
    setFoodToEdit(food);
    setIsAddNewFoodModalOpen(true);
  };

  // Handler for initiating food deletion
  const handleDeleteClick = (food: FoodItem) => {
    setFoodToDelete(food);
    setShowDeleteConfirm(true);
  };

  // Handler for confirming food deletion
  const handleConfirmDelete = () => {
    if (foodToDelete) {
      deleteFood(foodToDelete.id);
      setShowDeleteConfirm(false);
      setFoodToDelete(null);
    }
  };

  // Handler for canceling food deletion
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setFoodToDelete(null);
  };

  // Handler for saving a food (new or edited)
  const handleSaveFood = (food: FoodItem) => {
    if (foodToEdit) {
      updateFood(food);
    } else {
      addFood(food);
    }
  };

  return (
    <div className="food-database-screen">
      <button className="add-food-button" onClick={handleAddNewFood}>
        Add New Food
      </button>

      {foods.length === 0 ? (
        <div className="empty-state">
          <p>No foods in your database yet.</p>
          <p>Click "Add New Food" to create your first food item.</p>
        </div>
      ) : (
        <div className="food-list">
          <table className="food-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Macro Per</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fats</th>
                <th>Calories</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {foods.map(food => (
                <tr key={food.id}>
                  <td>{food.name}</td>
                  <td>{food.unit}</td>
                  <td>{food.macroPer}</td>
                  <td>{food.protein}g</td>
                  <td>{food.carbs}g</td>
                  <td>{food.fats}g</td>
                  <td>{food.calories} kcal</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-button" 
                      onClick={() => handleEditFood(food)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteClick(food)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && foodToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-button" onClick={handleCancelDelete}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{foodToDelete.name}</strong>?</p>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleCancelDelete}>Cancel</button>
              <button type="button" className="delete-confirm-button" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AddNewFoodModal
        isOpen={isAddNewFoodModalOpen}
        onClose={() => {
          setIsAddNewFoodModalOpen(false);
          setFoodToEdit(null);
        }}
        onSaveFood={handleSaveFood}
        editFood={foodToEdit}
      />
    </div>
  );
};

export default FoodDatabaseScreen; 