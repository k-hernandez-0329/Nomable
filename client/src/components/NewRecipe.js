import React, { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const NewRecipe = () => {
  const initialValues = {
    title: "",
    description: "",
    instructions: "",
    image_url: "",
    meal_type: "",
    ingredients: [],
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    instructions: Yup.string().required("Instructions are required"),
    image_url: Yup.string().url("Invalid URL"),
    meal_type: Yup.string().required("Meal type is required"),
    ingredients: Yup.array()
      .of(Yup.string().required("Ingredient is required"))
      .min(1, "At least one ingredient is required"),
  });

  const [submissionError, setSubmissionError] = useState(null);

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
      console.log("New recipe added:", data);
      resetForm();
      setSubmissionError(null); // Clear any previous submission errors
    } catch (error) {
      console.error("Error adding recipe:", error);
      setSubmissionError("Failed to add recipe. Please try again."); // Set submission error message
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="recipe-form">
      <h2>Add New Recipe</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
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
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div>
                    {values.ingredients.map((ingredient, index) => (
                      <div key={index}>
                        <Field name={`ingredients[${index}]`} />
                        <ErrorMessage
                          name={`ingredients[${index}]`}
                          component="div"
                          className="error-message"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={values.ingredients.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => push("")}>
                      Add Ingredient
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>

            {submissionError && (
              <div className="error-message">{submissionError}</div>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewRecipe;
