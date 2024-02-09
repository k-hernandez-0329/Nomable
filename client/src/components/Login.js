import React, { useContext} from "react";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "./AuthContext";

function Login({onLogin}) {
  const { setUser } = useContext(AuthContext);
  const history = useHistory();
function handleSubmit(values, { setSubmitting }) {
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((user) => {
     
      setUser(user);
      onLogin(user);
      history.push("/");
    })
    .catch((error) => {
      console.error("Login error:", error);
    
    })
    .finally(() => {
      setSubmitting(false);
    });
}

return (
  <div className="login-container">
    <h2 className="login-heading">But first log in!</h2>
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="login-form">
          <ErrorMessage
            className="login-error"
            name="username"
            component="div"
          />
          <Field
            className="login-field"
            type="text"
            name="username"
            placeholder="Username"
          />

          <ErrorMessage
            className="login-error"
            name="password"
            component="div"
          />
          <Field
            className="login-field"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </Form>
      )}
    </Formik>
  </div>
);
}

export default Login;
