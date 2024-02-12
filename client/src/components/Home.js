import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "../index.css";

function Home({ isAuthenticated }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [recipes, setRecipes] = useState([]);

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
    } else {
      setRecipes([]);
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
                recipes.map((recipes, index) => (
                  <div key={index} className="meal-placeholder">
                    <h2>{recipes.title}</h2>
                    <p>{recipes.description}</p>
                    <p>{recipes.instructions}</p>
                    <p>{recipes.meal_type}</p>
                    <img src={recipes.image_url} alt={recipes.title} />
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