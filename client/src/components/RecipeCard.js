import React from "react";
import "../index.css";

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image_url} alt={recipe.title} />
      <div className="recipe-details">
        <h3>{recipe.title}</h3>
        <p>{recipe.description}</p>
        <p>{recipe.instructions}</p>
        <p>Meal Type: {recipe.meal_type}</p>
      </div>
    </div>
  );
}

export default RecipeCard;
