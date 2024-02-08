// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import "../index.css";

// import RecipeCard from "./RecipeCard";

// function RecipeList() {
//   const [recipes, setRecipes] = useState([]);

//   const initialValues = {
//     title: "",
//     description: "",
//     instructions: "",
//     image_url: "",
//     meal_type: "",
//     ingredients: [],
//   };

//   const validationSchema = Yup.object().shape({
//     title: Yup.string().required("Title is required"),
//     description: Yup.string().required("Description is required"),
//     instructions: Yup.string().required("Instructions are required"),
//     image_url: Yup.string().url("Invalid URL"),
//     meal_type: Yup.string().required("Meal type is required"),
//   });

//   useEffect(() => {
//     fetch("/recipes")
//       .then((res) => res.json())
//       .then((data) => {
//         setRecipes(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching recipes:", error);
//       });
//   }, []);

//   const handleSubmit = (values, { setSubmitting, resetForm }) => {
//     fetch("/recipes", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(values),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setRecipes([...recipes, data]);
//         resetForm();
//       })
//       .catch((error) => {
//         console.error("Error creating recipe:", error);
//       })
//       .finally(() => {
//         setSubmitting(false);
//       });
//   };

//   return (
//     <div className="recipe-list">
//       <h2>Recipes</h2>
//       <div className="recipe-form">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, values }) => (
//             <Form>
//               <div className="form-group">
//                 <label>Title:</label>
//                 <Field type="text" name="title" />
//                 <ErrorMessage
//                   name="title"
//                   component="div"
//                   className="error-message"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Description:</label>
//                 <Field type="text" name="description" />
//                 <ErrorMessage
//                   name="description"
//                   component="div"
//                   className="error-message"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Instructions:</label>
//                 <Field type="text" name="instructions" />
//                 <ErrorMessage
//                   name="instructions"
//                   component="div"
//                   className="error-message"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Image URL:</label>
//                 <Field type="text" name="image_url" />
//                 <ErrorMessage
//                   name="image_url"
//                   component="div"
//                   className="error-message"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Meal Type:</label>
//                 <Field
//                   type="text"
//                   name="meal_type"
//                   placeholder="Breakfast/Lunch/Dinner..."
//                 />
//                 <ErrorMessage
//                   name="meal_type"
//                   component="div"
//                   className="error-message"
//                 />
//               </div>
//               <div className="form-group ingredients-group">
//                 <label>Ingredients:</label>
//                 <FieldArray name="ingredients">
//                   {({ push, remove }) => (
//                     <div className="ingredients-list">
//                       {values.ingredients.map((ingredient, index) => (
//                         <div key={index}>
//                           <Field
//                             type="text"
//                             name={`ingredients.${index}`}
//                             placeholder="Enter ingredient"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => remove(index)}
//                             className="remove-ingredient-btn"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={() => push("")}
//                         className="add-ingredient-btn"
//                       >
//                         Add Ingredient
//                       </button>
//                     </div>
//                   )}
//                 </FieldArray>
//               </div>

//               <button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//       <div className="recipe-cards">
//         {recipes.map((recipe) => (
//           <RecipeCard key={recipe.id} recipe={recipe} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RecipeList;