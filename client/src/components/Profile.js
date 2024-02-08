import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import donut from "../donut.png";
import fried_egg from "../fried-egg.png";
import gummy_bear from "../gummy-bear.png";
import taco from "../taco.png";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [updateError, setUpdateError] = useState(null);

  const initialValues = {
    username: user.username,
    password: "", 
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      
      const response = await fetch(`/profiles/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      
      setUser({
        ...user,
        username: values.username,
       
      });

      
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateError("Failed to update profile. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  
  const renderAvatar = () => {
    switch (user.avatar) {
      case "donut.png":
        return <img src={donut} alt="Donut Avatar" className="avatar-option" />;
      case "fried-egg.png":
        return (
          <img
            src={fried_egg}
            alt="Fried Egg Avatar"
            className="avatar-option"
          />
        );
      case "gummy-bear.png":
        return (
          <img
            src={gummy_bear}
            alt="Gummy Bear Avatar"
            className="avatar-option"
          />
        );
      case "taco.png":
        return <img src={taco} alt="Taco Avatar" className="avatar-option" />;
      default:
        return <div className="avatar-placeholder">Avatar Not Found</div>;
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-info">
        <div>
          
          {renderAvatar()}
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label>Username:</label>
                <Field type="text" name="username" />
                <ErrorMessage name="username" />
              </div>
              <div>
                <label>Password:</label>
                <Field type="password" name="password" />
                <ErrorMessage name="password" />
              </div>
              {updateError && <div className="error">{updateError}</div>}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;