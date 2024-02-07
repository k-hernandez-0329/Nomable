import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; 
import { AuthContext } from "./AuthContext"; // Assuming you have an AuthContext defined
import donut from "../donut.png"; 
import fried_egg from "../fried-egg.png"; 
import gummy_bear from "../gummy-bear.png"; 
import taco from "../taco.png"; 
import "../index.css";
function SignUp() {
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Sign up failed");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      // Reset submitting state regardless of success or failure
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      <Formik
        initialValues={{ username: "", email: "", password: "", avatar: null }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Username is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <ErrorMessage
              className="signup-error"
              name="username"
              component="div"
            />
            <Field
              className="signup-field"
              type="text"
              name="username"
              placeholder="Username"
            />

            <ErrorMessage
              className="signup-error"
              name="email"
              component="div"
            />
            <Field
              className="signup-field"
              type="email"
              name="email"
              placeholder="Email"
            />

            <ErrorMessage
              className="signup-error"
              name="password"
              component="div"
            />
            <Field
              className="signup-field"
              type="password"
              name="password"
              placeholder="Password"
            />

            <ErrorMessage
              className="signup-error"
              name="avatar"
              component="div"
            />
            <div className="avatar-selection">
              <h3>Choose Avatar</h3>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value="../donut.png" />
                <img src={donut} alt="Donut" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value="../fried-egg.png" />
                <img src={fried_egg} alt="Fried Egg" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value="../gummy-bear.png" />
                <img src={gummy_bear} alt="Gummy Bear" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value="../taco.png" />
                <img src={taco} alt="Taco" />
              </label>
            </div>
            <button
              className="signup-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUp;



            