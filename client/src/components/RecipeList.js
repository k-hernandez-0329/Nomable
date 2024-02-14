import React from "react";
import RecipeCard from "./RecipeCard";

function RecipeList({ favoriteRecipes }) {
  return (
    <div className="recipe-cards">
      {/* Display favorite recipes */}
      {favoriteRecipes.length > 0 ? (
        <div>
          <h2>Favorite Recipes</h2>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default RecipeList;
