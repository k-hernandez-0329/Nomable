import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "./AuthContext";
import donut from "../donut.png";
import fried_egg from "../fried-egg.png";
import gummy_bear from "../gummy-bear.png";
import taco from "../taco.png";
import "../index.css";

function SignUp() {
  const { user, setUser } = useContext(AuthContext); // Assuming you have user data in context
  const [signupError, setSignupError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

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
      setIsLoggedIn(true); 
    } catch (error) {
      console.error("Sign up error:", error);
      if (error.message.includes("email")) {
        setSignupError("Email is already in use");
      } else if (error.message.includes("username")) {
        setSignupError("Username is already taken");
      } else {
        setSignupError("Sign up failed. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return <Redirect to="/" />; 
  }

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>
      <Formik
        initialValues={{ username: "", email: "", password: "", avatar: "" }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required("Username is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          password: Yup.string().required("Password is required"),
          avatar: Yup.string().required("Avatar is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
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
              <h3>Choose An Avatar:</h3>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value={donut} />
                <img src={donut} alt="Donut" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value={fried_egg} />
                <img src={fried_egg} alt="Fried Egg" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value={gummy_bear} />
                <img src={gummy_bear} alt="Gummy Bear" />
              </label>
              <label className="avatar-option">
                <Field type="radio" name="avatar" value={taco} />
                <img src={taco} alt="Taco" />
              </label>
            </div>

            {signupError && <div className="error">{signupError}</div>}

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
