import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const NewRecipe = () => {
  const initialValues = {
    title: "",
    description: "",
    instructions: "",
    image_url: "",
    meal_type: "",
    ingredients: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    instructions: Yup.string().required("Instructions are required"),
    image_url: Yup.string().url("Invalid URL"),
    meal_type: Yup.string().required("Meal type is required"),
    ingredients: Yup.string().required("Ingredients are required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }
      const data = await response.json();
      // Handle setting recipes if needed
      resetForm();
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recipe-list">
      <div className="recipe-form">
        <h2>Recipes</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label>Title:</label>
                <Field type="text" name="title" />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <Field type="text" name="description" />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label>Instructions:</label>
                <Field type="text" name="instructions" />
                <ErrorMessage
                  name="instructions"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <Field type="text" name="image_url" />
                <ErrorMessage
                  name="image_url"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label>Meal Type:</label>
                <Field
                  type="text"
                  name="meal_type"
                  placeholder="Breakfast/Lunch/Dinner..."
                />
                <ErrorMessage
                  name="meal_type"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group ingredients-group">
                <label>Ingredients:</label>
                <Field
                  type="text"
                  name="ingredients"
                  placeholder="Enter ingredients separated by commas"
                />
                <ErrorMessage
                  name="ingredients"
                  component="div"
                  className="error-message"
                />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewRecipe;
