import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Header from "./Header";
import "../index.css";
import RecipeList from "./RecipeList";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import Navbar from "./NavBar";
import Profile from "./Profile";
import NewRecipe from "./NewRecipe";
import JournalEntry from "./JournalEntry"

function App() {
  const [user, setUser] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const history = useHistory();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    document.title = "Nomable";
    return () => {
      document.title = "Default Tab Name";
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/check_session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setUser_id(userData.user_id);
          fetchFavoriteRecipes(userData.user_id); // Fetch favorite recipes after user is set
        } else {
          throw new Error("Session check failed");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    checkSession();
  }, []);

  // Fetch favorite recipes for the user
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

  function handleLogin(user) {
    setUser(user);
    setUser_id(user.id);
    fetchFavoriteRecipes(user.id); // Fetch favorite recipes after user login
  }

  function handleLogout() {
    setUser(null);
    setUser_id(null);
    setFavoriteRecipes([]); // Reset favorite recipes on logout
    history.push("/");
  }

  return (
    <Router>
      <div>
        <Header user={user} />
        {user && <Navbar user={user} />}
        <SearchBar />
        <Switch>
          <Route path="/journal-entry" component={JournalEntry}/>
          <Route exact path="/new-recipe" component={NewRecipe} />
          <Route
            path="/recipes"
            render={(props) => (
              <RecipeList {...props} favoriteRecipes={favoriteRecipes} />
            )}
          />
          <Route
            path="/profile"
            render={(props) => (
              <Profile {...props} user={user} onLogout={handleLogout} />
            )}
          />
          <Route path="/signup" component={SignUp} />
          <Route path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route
            exact
            path="/"
            render={() => (
              <Home
                isAuthenticated={user !== null}
                user_id={user_id}
                onFavoriteRecipe={fetchFavoriteRecipes} // Pass function to update favorite recipes
              />
            )}
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   useHistory,
// } from "react-router-dom";
// import Header from "./Header";
// import "../index.css";
// import RecipeList from "./RecipeList";
// import Footer from "./Footer";
// import SearchBar from "./SearchBar";
// import SignUp from "./SignUp";
// import Login from "./Login";
// import Home from "./Home";
// import Navbar from "./NavBar";
// import Profile from "./Profile";

// function App() {
//   const [user, setUser] = useState(null);
//   const [user_id, setUser_id] = useState(null); // Add user_id state
//   const history = useHistory();
//   const [favoriteRecipes, setFavoriteRecipes] = useState([]);

//   useEffect(() => {
//     document.title = "Nomable";
//     return () => {
//       document.title = "Default Tab Name";
//     };
//   }, []);

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await fetch("/check_session");
//         if (response.ok) {
//           const userData = await response.json();
//           setUser(userData);
//           setUser_id(userData.user_id); // Extract and set user_id
//         } else {
//           throw new Error("Session check failed");
//         }
//       } catch (error) {
//         console.error("Session check error:", error);
//       }
//     };

//     checkSession();
//   }, []);

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

//   function handleLogin(user) {
//     setUser(user);
//     setUser_id(user.id); // Extract and set user_id
//   }

//   function handleLogout() {
//     setUser(null);
//     setUser_id(null); // Reset user_id on logout
//     history.push("/");
//   }

//   return (
//     <Router>
//       <div>
//         <Header user={user} />
//         {user && <Navbar user={user} />}
//         <SearchBar />
//         <Switch>
//           <Route
//             path="/recipes"
//             render={(props) => (
//               <RecipeList {...props} favoriteRecipes={favoriteRecipes} />
//             )}
//           />
//           <Route
//             path="/profile"
//             render={(props) => (
//               <Profile {...props} user={user} onLogout={handleLogout} />
//             )}
//           />
//           <Route path="/signup" component={SignUp} />
//           <Route path="/login">
//             <Login onLogin={handleLogin} />
//           </Route>
//           <Route
//             exact
//             path="/"
//             render={() => (
//               <Home
//                 isAuthenticated={user !== null}
//                 user_id={user_id}/>

//             )}
//           />
//         </Switch>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
// import Header from "./Header"
// import "../index.css";
// import RecipeList from "./RecipeList"
// import Footer from "./Footer";
// import SearchBar from "./SearchBar";
// import SignUp from "./SignUp";
// import Login from "./Login";
// import Home from "./Home";
// import Navbar from "./NavBar";
// import Profile from "./Profile";

// function App() {
//   const [user, setUser] = useState(null);
//   const history = useHistory();

//   useEffect(() => {
//     document.title = "Nomable";
//     return () => {
//       document.title = "Default Tab Name";
//     };
//   }, []);

//   // useEffect(() => {
//   //   const checkSession = async () => {
//   //     try {
//   //       const response = await fetch("/check_session");
//   //       if (response.ok) {
//   //         const userData = await response.json();
//   //         setUser(userData);
//   //       } else {
//   //         throw new Error("Session check failed");
//   //       }
//   //     } catch (error) {
//   //       console.error("Session check error:", error);
//   //     }
//   //   };

//   //   checkSession();
//   // }, []);

//   function handleLogin(user) {
//     setUser(user);
//   }

//   function handleLogout() {
//     setUser(null);
//     history.push("/");
//   }

//   return (
//     <Router>
//       <div>
//         <Header user={user} />
//         {user && <Navbar user={user} />}
//         <SearchBar />
//         <Switch>
//           <Route path="/recipes" component={RecipeList} />
//           <Route path="/profile" component={Profile} onLogout={handleLogout} />
//           <Route path="/signup" component={SignUp} />
//           <Route path="/login">
//             <Login onLogin={handleLogin} />
//           </Route>
//           <Route
//             exact
//             path="/"
//             render={() => <Home isAuthenticated={user !== null} />}
//           />
//         </Switch>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
