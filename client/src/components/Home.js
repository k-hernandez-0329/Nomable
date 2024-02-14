import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import moment from "moment";
import "../index.css";

function Home({ isAuthenticated, user_id }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [recipeRatings, setRecipeRatings] = useState([]);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/recipes")
        .then((res) => res.json())
        .then((data) => {
          setRecipes(data);
        })
        .catch((error) => {
          console.error("Error fetching recipes:", error);
          setRecipes([]);
        });

      fetch("/ingredients")
        .then((res) => res.json())
        .then((data) => {
          setIngredients(data);
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
          setIngredients([]);
        });
    } else {
      setRecipes([]);
      setIngredients([]);
    }
  }, [isAuthenticated]);

  function calculateTimeLeft() {
    const currentDate = moment();
    const targetDate = moment().endOf("day").add(1, "day");

    const duration = moment.duration(targetDate.diff(currentDate));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    return {
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds,
    };
  }

  const handleFavorite = (userId, recipeId) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    const updatedRecipes = [...recipes];
    const recipeIndex = updatedRecipes.findIndex(
      (recipe) => recipe.id === recipeId
    );

    if (recipeIndex === -1) {
      console.error("Recipe not found");
      return;
    }

    updatedRecipes[recipeIndex] = {
      ...updatedRecipes[recipeIndex],
      favorited: !updatedRecipes[recipeIndex].favorited,
    };
    setRecipes(updatedRecipes);

    // Update favorite recipes if necessary
    const updatedFavoriteRecipes = updatedRecipes.filter(
      (recipe) => recipe.favorited
    );
    setFavoriteRecipes(updatedFavoriteRecipes);

    fetch(`/favorite_recipes/${userId}/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorited: updatedRecipes[recipeIndex].favorited,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update favorite status");
        }
      })
      .catch((error) => {
        console.error("Error updating favorite status:", error);
        setRecipes(recipes); // Revert the local changes if there's an error
      });
  };
  const handleRateRecipe = (recipeId) => {
    if (newRating < 1 || newRating > 5) {
      console.error("Invalid rating value:", newRating);
      return;
    }

    fetch(`/recipe_ratings/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user_id, recipe_rating: newRating }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to rate recipe");
        }
        // Logic to update recipe ratings
        const updatedRecipeRatings = recipeRatings.map((recipeRating) => {
          if (recipeRating.recipeId === recipeId) {
            return {
              ...recipeRating,
              ratings: [...recipeRating.ratings, { value: newRating }],
            };
          }
          return recipeRating;
        });
        setRecipeRatings(updatedRecipeRatings);
        setNewRating(0); // Reset the new rating after submitting
      })
      .catch((error) => {
        console.error("Error rating recipe:", error);
      });
  };

  // Add a function to handle rating change
  const handleRatingChange = (event) => {
    const rating = parseInt(event.target.value);
    setNewRating(rating);
  };

  return (
    <div className="container">
      <div className="homepage">
        {isAuthenticated && (
          <div className="countdown-timer">
            Time left for today's recipes:
            <br />
            <span className="timer-item">{timeLeft.hours}</span>:
            <span className="timer-item">{timeLeft.minutes}</span>:
            <span className="timer-item">{timeLeft.seconds}</span>
          </div>
        )}
        <h1 className="homepage-heading">
          {isAuthenticated ? "Recipes" : "Welcome to Nomable!"}
        </h1>
        {isAuthenticated ? (
          <>
            <p className="homepage-description">
              Explore new recipes, save your favorites, and personalize your
              culinary journey with Nomable.
            </p>
            <div className="meal-placeholder-container">
              {recipes.length > 0 ? (
                recipes.map((recipe, index) => (
                  <div key={index} className="meal-placeholder">
                    <h2>{recipe.title}</h2>
                    <img src={recipe.image_url} alt={recipe.title} />
                    <p>{recipe.description}</p>
                    <p>Instructions: {recipe.instructions}</p>
                    <p>Meal Type: {recipe.meal_type}</p>
                    <ul>
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient.name}</li>
                        ))
                      ) : (
                        <li>No ingredients available</li>
                      )}
                    </ul>
                    <button onClick={() => handleFavorite(user_id, recipe.id)}>
                      {recipe.favorited ? "Unfavorite" : "Favorite"}
                    </button>
                    <button onClick={() => handleRateRecipe(recipe.id)}>
                      Rate Recipe
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newRating}
                      onChange={handleRatingChange}
                    />
                  </div>
                ))
              ) : (
                <p>No recipes available</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="homepage-description">
              Nomable is a revolutionary solution for individuals grappling with
              the perennial question of "What's for dinner?". Nomable
              streamlines the meal planning process by presenting users with a
              curated selection of three recipes daily, spanning breakfast,
              lunch, and dinner.
            </p>
            <p className="homepage-how-it-works">
              How it Works: Upon logging in, users are greeted with a concise
              list of three delectable recipes, carefully selected to cater to a
              variety of tastes and dietary preferences. With a countdown timer
              of the 24-hour window, users have a limited time to peruse and
              decide on their culinary adventures for the day.
            </p>
            <br />
            <strong className="homepage-tagline">
              Nomable: Fueling Your Culinary Adventures!
            </strong>
            <br />
            <br />
            <Link to="/signup" className="homepage-signup-link">
              <button className="homepage-signup-button">Sign Up</button>
            </Link>
            <br />
            <p className="homepage-login-link">
              Already a member? <Link to="/login">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
// function Home({ isAuthenticated }) {
//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearTimeout(timer);
//   });

//   function calculateTimeLeft() {
//     const currentDate = moment();
//     const targetDate = moment().endOf("day").add(1, "day");

//     const duration = moment.duration(targetDate.diff(currentDate));
//     const hours = duration.hours();
//     const minutes = duration.minutes();
//     const seconds = duration.seconds();

//     return {
//       hours: hours < 10 ? `0${hours}` : hours,
//       minutes: minutes < 10 ? `0${minutes}` : minutes,
//       seconds: seconds < 10 ? `0${seconds}` : seconds,
//     };
//   }

//   return (
//     <div className="container">
//       <div className="homepage">
//         {isAuthenticated && (
//           <div className="countdown-timer">
//             Time left for today's recipes:
//             <br />
//             <span className="timer-item">{timeLeft.hours}</span>:
//             <span className="timer-item">{timeLeft.minutes}</span>:
//             <span className="timer-item">{timeLeft.seconds}</span>
//           </div>
//         )}
//         <h1 className="homepage-heading">
//           {isAuthenticated ? "Recipes" : "Welcome to Nomable!"}
//         </h1>
//         {isAuthenticated ? (
//           <>
//          <p className="homepage-description">
//               Explore new recipes, save your favorites, and personalize your
//               culinary journey with Nomable.
//             </p>

//             <div className="meal-placeholder-container">

//             <div className="meal-placeholder">
//               <h2>Breakfast Placeholder</h2>

//             </div>
//             <div className="meal-placeholder">
//               <h2>Lunch Placeholder</h2>

//             </div>
//             <div className="meal-placeholder">
//               <h2>Dinner Placeholder</h2>

//             </div>
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="homepage-description">
//               Nomable is a revolutionary solution for individuals grappling with
//               the perennial question of "What's for dinner?". Nomable
//               streamlines the meal planning process by presenting users with a
//               curated selection of three recipes daily, spanning breakfast,
//               lunch, and dinner.
//             </p>
//             <p className="homepage-how-it-works">
//               How it Works: Upon logging in, users are greeted with a concise
//               list of three delectable recipes, carefully selected to cater to a
//               variety of tastes and dietary preferences. With a countdown timer
//               of the 24-hour window, users have a limited time to peruse and
//               decide on their culinary adventures for the day.
//             </p>
//             <br />
//             <strong className="homepage-tagline">
//               Nomable: Fueling Your Culinary Adventures!
//             </strong>
//             <br />
//             <br />
//             <Link to="/signup" className="homepage-signup-link">
//               <button className="homepage-signup-button">Sign Up</button>
//             </Link>
//             <br />
//             <p className="homepage-login-link">
//               Already a member? <Link to="/login">Login</Link>
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;
