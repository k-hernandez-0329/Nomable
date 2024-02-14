import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import donut from "../donut.png";
import fried_egg from "../fried-egg.png";
import gummy_bear from "../gummy-bear.png";
import taco from "../taco.png";
import { useHistory } from "react-router-dom";

function Profile() {
  const { user, setUser, handleLogout } = useContext(AuthContext);
  const [updateError, setUpdateError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const history = useHistory();

  if (!user) {
    return <div></div>;
  }

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch(`/users/${user.id}`, {
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
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateError("Failed to update profile. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );
  if (confirmDelete) {
    try {
      const response = await fetch(`/users/${user.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        handleLogout();
        history.push("/");
      } else {
        throw new Error("Failed to delete profile");
      }
    } catch (error) {
      console.error("Profile deletion error:", error);
    }
  }
};

  function logout() {
    console.log("Logging out...");
    fetch("/logout", {
      method: "DELETE",
    })
      .then(() => {
        console.log("Logout successful.");
        handleLogout();
        history.push("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }

  const renderAvatar = () => {
    switch (user.avatar) {
      case donut:
        return <img src={donut} alt="Donut Avatar" className="avatar-option" />;
      case fried_egg:
        return (
          <img
            src={fried_egg}
            alt="Fried Egg Avatar"
            className="avatar-option"
          />
        );
      case gummy_bear:
        return (
          <img
            src={gummy_bear}
            alt="Gummy Bear Avatar"
            className="avatar-option"
          />
        );
      case taco:
        return <img src={taco} alt="Taco Avatar" className="avatar-option" />;
      default:
        return <div className="avatar-placeholder">Avatar Not Found</div>;
    }
  };

  return (
    <div className="profile">
      <h2 className="profile-heading">{user.username}'s Account</h2>
      <div className="profile-info">
        <div className="avatar-container">{renderAvatar()}</div>

        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
        <br />
        {isEditing && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="profile-form">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Username:
                  </label>
                  <Field type="text" name="username" className="form-input" />
                  <ErrorMessage name="username" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <Field
                    type="password"
                    name="password"
                    className="form-input"
                  />
                  <ErrorMessage name="password" className="error" />
                </div>
                {updateError && <div className="error">{updateError}</div>}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        )}
        <button onClick={logout} className="profile-logout-button">
          Logout
        </button>
        <br />
        <button onClick={handleDelete} className="delete-button">
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;
