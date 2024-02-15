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
  const [selectedRating, setSelectedRating] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

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

      fetch(`/recipe_ratings/${user_id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch recipe ratings");
          }
          return res.json();
        })
        .then((data) => {
          setRecipeRatings(data);
        })
        .catch((error) => {
          console.error("Error fetching recipe ratings:", error);
        });
    } else {
      setRecipes([]);
      setIngredients([]);
      setRecipeRatings([]);
    }
  }, [isAuthenticated, user_id]);

  useEffect(() => {
    // Fetch favorite recipes when user_id changes
    if (user_id) {
      fetchFavoriteRecipes(user_id);
    }
  }, [user_id]);

  function calculateTimeLeft() {
    const currentDate = moment();
    const targetDate = moment().endOf("day").add(1, "day");

    const duration = moment.duration(targetDate.diff(currentDate));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (hours === 0 && minutes === 0 && seconds === 0) {
      // If the timer has reached 00:00:00, fetch new recipes
      newRecipes();
    }
    return {
      hours: hours < 10 ? `0${hours}` : hours,
      minutes: minutes < 10 ? `0${minutes}` : minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds,
    };
  }
   const newRecipes = () => {
     fetch("/new_recipes")
       .then((res) => res.json())
       .then((data) => {
         setRecipes(data);
       })
       .catch((error) => {
         console.error("Error fetching new recipes:", error);
       });
   };

  

  const handleFavorite = (recipeId) => {
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

    const updatedFavoriteRecipes = updatedRecipes.filter(
      (recipe) => recipe.favorited
    );
    setFavoriteRecipes(updatedFavoriteRecipes);

    // Update favorite recipes on the server
    const favorited = updatedRecipes[recipeIndex].favorited;
    updateFavoriteRecipeOnServer(user_id, recipeId, favorited);
  };

  const updateFavoriteRecipeOnServer = (userId, recipeId, favorited) => {
    fetch(`/favorite_recipes/${userId}/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorited: favorited,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update favorite status");
        }
      })
      .then(() => {
        // Fetch favorite recipes again to update the state
        fetchFavoriteRecipes(userId);
      })
      .catch((error) => {
        console.error("Error updating favorite status:", error);
      });
  };

  const fetchFavoriteRecipes = async (userId) => {
    try {
      const response = await fetch(`/favorite_recipes/${userId}`);
      if (response.ok) {
        const favoriteRecipesData = await response.json();
        setFavoriteRecipes(favoriteRecipesData);
      } else {
        throw new Error("Failed to fetch favorite recipes");
      }
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    }
  };

  const updateRecipeRating = (recipeId, rating) => {
    // Find the index of the recipe rating in the array
    const index = recipeRatings.findIndex(
      (rating) => rating.recipe_id === recipeId
    );
    if (index !== -1) {
      // Update the existing rating if found
      const updatedRatings = [...recipeRatings];
      updatedRatings[index] = { recipe_id: recipeId, value: rating };
      setRecipeRatings(updatedRatings);
    } else {
      // Add a new rating if not found
      setRecipeRatings((prevRatings) => [
        ...prevRatings,
        { recipe_id: recipeId, value: rating },
      ]);
    }
  };

  const handleRateRecipe = (recipeId, rating) => {
    if (rating < 1 || rating > 5) {
      console.error("Invalid rating value:", rating);
      return;
    }

    fetch(`/recipe_ratings/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        recipe_id: recipeId,
        rating: rating,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to rate recipe");
        }
        // Update the local state with the new rating
        updateRecipeRating(recipeId, rating);
        // Update the selected rating state
        setSelectedRating(rating);
      })
      .catch((error) => {
        console.error("Error rating recipe:", error);
      });
  };

    const shareViaEmail = (recipeId, recipeTitle) => {
      const recipeUrl = window.location.href; // Get the current page URL
      const subject = encodeURIComponent(
        `Check out this delicious recipe: ${recipeTitle} `
      );
      const body = encodeURIComponent(
        `I thought you might like this recipe: ${recipeUrl}`
      );
      const emailShareUrl = `mailto:?subject=${subject}&body=${body}`;
      window.location.href = emailShareUrl;
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
                    <h3>{recipe.description}</h3>
                    <p>Meal Type: {recipe.meal_type}</p>
                    <p>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                      >
                        {showInstructions
                          ? "Hide Instructions"
                          : "Show Instructions"}
                      </button>
                    </p>
                    {showInstructions && (
                      <p>
                        Instructions: <br />
                        {recipe.instructions}
                      </p>
                    )}

                    <div className="social-share-buttons">
                      <button
                        onClick={() => shareViaEmail(recipe.id, recipe.title)}
                      >
                        Share This With Friends!
                      </button>
                    </div>
                    <ul>
                      {recipe.ingredients && recipe.ingredients.length > 0 ? (
                        recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>{ingredient.name}</li>
                        ))
                      ) : (
                        <li>No ingredients available</li>
                      )}
                    </ul>
                    {/* <button onClick={() => handleFavorite(recipe.id)}>
                      {recipe.favorited ? "Unfavorite" : "Favorite"}
                    </button> */}

                    <div>
                      Rate This Recipe!
                      <br />
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <span
                          key={rating}
                          onClick={() => handleRateRecipe(recipe.id, rating)}
                          style={{
                            cursor: "pointer",
                            color:
                              Array.isArray(recipeRatings) &&
                              recipeRatings.find(
                                (r) => r.recipe_id === recipe.id
                              )?.value >= rating
                                ? "gold"
                                : "gray",
                            fontSize: "24px",
                            marginRight: "5px",
                          }}
                        >
                          &#9733; {/* Unicode character for a star */}
                        </span>
                      ))}
                    </div>
                    {/* <div>
                      <h3>Recipe Ratings</h3>
                      <ul>
                        {recipeRatings
                          .filter((rating) => rating.recipe_id === recipe.id)
                          .map((filteredRating, index) => (
                            <li key={index}>Rating: {filteredRating.value}</li>
                          ))}
                      </ul>
                    </div> */}
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

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import moment from "moment";
// import "../index.css";

// function Home({ isAuthenticated, user_id }) {
//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
//   const [recipes, setRecipes] = useState([]);
//   const [ingredients, setIngredients] = useState([]);
//   const [favoriteRecipes, setFavoriteRecipes] = useState([]);
//   const [recipeRatings, setRecipeRatings] = useState([]);
//   const [newRating, setNewRating] = useState(0);
//   const [selectedRating, setSelectedRating] = useState(0);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearTimeout(timer);
//   });

//   useEffect(() => {
//     if (isAuthenticated) {
//       fetch("/recipes")
//         .then((res) => res.json())
//         .then((data) => {
//           setRecipes(data);
//         })
//         .catch((error) => {
//           console.error("Error fetching recipes:", error);
//           setRecipes([]);
//         });

//       fetch("/ingredients")
//         .then((res) => res.json())
//         .then((data) => {
//           setIngredients(data);
//         })
//         .catch((error) => {
//           console.error("Error fetching ingredients:", error);
//           setIngredients([]);
//         });

//       fetch("/recipe_ratings")
//         .then((res) => res.json())
//         .then((data) => {
//           setRecipeRatings(data);
//         })
//         .catch((error) => {
//           console.error("Error fetching recipe ratings:", error);
//           setRecipeRatings([]);
//         });
//     } else {
//       setRecipes([]);
//       setIngredients([]);
//       setRecipeRatings([]);
//     }
//   }, [isAuthenticated]);

//   useEffect(() => {
//     // Fetch favorite recipes when user_id changes
//     if (user_id) {
//       fetchFavoriteRecipes(user_id);
//     }
//   }, [user_id]);

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

//   const handleFavorite = (recipeId) => {
//     const updatedRecipes = [...recipes];
//     const recipeIndex = updatedRecipes.findIndex(
//       (recipe) => recipe.id === recipeId
//     );

//     if (recipeIndex === -1) {
//       console.error("Recipe not found");
//       return;
//     }

//     updatedRecipes[recipeIndex] = {
//       ...updatedRecipes[recipeIndex],
//       favorited: !updatedRecipes[recipeIndex].favorited,
//     };
//     setRecipes(updatedRecipes);

//     const updatedFavoriteRecipes = updatedRecipes.filter(
//       (recipe) => recipe.favorited
//     );
//     setFavoriteRecipes(updatedFavoriteRecipes);

//     // Update favorite recipes on the server
//     const favorited = updatedRecipes[recipeIndex].favorited;
//     updateFavoriteRecipeOnServer(user_id, recipeId, favorited);
//   };

//   const updateFavoriteRecipeOnServer = (userId, recipeId, favorited) => {
//     fetch(`/favorite_recipes/${userId}/${recipeId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         favorited: favorited,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to update favorite status");
//         }
//       })
//       .then(() => {
//         // Fetch favorite recipes again to update the state
//         fetchFavoriteRecipes(userId);
//       })
//       .catch((error) => {
//         console.error("Error updating favorite status:", error);
//       });
//   };

//   const fetchFavoriteRecipes = async (userId) => {
//     try {
//       const response = await fetch(`/favorite_recipes/${userId}`);
//       if (response.ok) {
//         const favoriteRecipesData = await response.json();
//         setFavoriteRecipes(favoriteRecipesData);
//       } else {
//         throw new Error("Failed to fetch favorite recipes");
//       }
//     } catch (error) {
//       console.error("Error fetching favorite recipes:", error);
//     }
//   };

//   const updateRecipeRating = (recipeId, rating) => {
//        // Find the index of the recipe rating in the array
//        const index = recipeRatings.findIndex(
//          (rating) => rating.recipe_id === recipeId
//        );
//        if (index !== -1) {
//          // Update the existing rating if found
//          const updatedRatings = [...recipeRatings];
//          updatedRatings[index] = { recipe_id: recipeId, value: rating };
//          setRecipeRatings(updatedRatings);
//        } else {
//          // Add a new rating if not found
//          setRecipeRatings((prevRatings) => [
//            ...prevRatings,
//            { recipe_id: recipeId, value: rating },
//          ]);
//        }
//      };

//   const handleRateRecipe = (recipeId, rating) => {
//     if (rating < 1 || rating > 5) {
//       console.error("Invalid rating value:", rating);
//       return;
//     }

//     fetch(`/recipe_ratings/${recipeId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_id: user_id,
//         recipe_id: recipeId,
//         rating: rating,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to rate recipe");
//         }
//         // Update the rating state for the specific recipe
//         const updatedRatings = [...recipeRatings];
//         const index = updatedRatings.findIndex((r) => r.recipe_id === recipeId);
//         if (index !== -1) {
//           updatedRatings[index] = { recipe_id: recipeId, value: rating };
//         } else {
//           updatedRatings.push({ recipe_id: recipeId, value: rating });
//         }
//         setRecipeRatings(updatedRatings);
//         // Update the selected rating state
//         setSelectedRating(rating);
//       })
//       .catch((error) => {
//         console.error("Error rating recipe:", error);
//       });
//   };

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
//             <p className="homepage-description">
//               Explore new recipes, save your favorites, and personalize your
//               culinary journey with Nomable.
//             </p>
//             <div className="meal-placeholder-container">
//               {recipes.length > 0 ? (
//                 recipes.map((recipe, index) => (
//                   <div key={index} className="meal-placeholder">
//                     <h2>{recipe.title}</h2>
//                     <img src={recipe.image_url} alt={recipe.title} />
//                     <p>{recipe.description}</p>
//                     <p>Instructions: {recipe.instructions}</p>
//                     <p>Meal Type: {recipe.meal_type}</p>
//                     <ul>
//                       {recipe.ingredients && recipe.ingredients.length > 0 ? (
//                         recipe.ingredients.map((ingredient, idx) => (
//                           <li key={idx}>{ingredient.name}</li>
//                         ))
//                       ) : (
//                         <li>No ingredients available</li>
//                       )}
//                     </ul>
//                     <button onClick={() => handleFavorite(recipe.id)}>
//                       {recipe.favorited ? "Unfavorite" : "Favorite"}
//                     </button>

//                     <div>
//                       Rate This Recipe!
//                       <br />
//                       {[1, 2, 3, 4, 5].map((rating) => (
//                         <span
//                           key={rating}
//                           onClick={() => handleRateRecipe(recipe.id, rating)}
//                           style={{
//                             cursor: "pointer",
//                             color:
//                               Array.isArray(recipeRatings) &&
//                               recipeRatings.find(
//                                 (r) => r.recipe_id === recipe.id
//                               )?.value >= rating
//                                 ? "gold"
//                                 : "gray",
//                             fontSize: "24px",
//                             marginRight: "5px",
//                           }}
//                         >
//                           &#9733; {/* Unicode character for a star */}
//                         </span>
//                       ))}
//                     </div>
//                     {/* <div>
//                       <h3>Recipe Ratings</h3>
//                       <ul>
//                         {recipeRatings
//                           .filter((rating) => rating.recipe_id === recipe.id)
//                           .map((filteredRating, index) => (
//                             <li key={index}>Rating: {filteredRating.value}</li>
//                           ))}
//                       </ul>
//                     </div> */}
//                   </div>
//                 ))
//               ) : (
//                 <p>No recipes available</p>
//               )}
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
