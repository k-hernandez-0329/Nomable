import React, { useState } from "react";
import ImageGallery from "./ImageGallery";

const JournalEntryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/submit_journal_entry_form", {
        method: "POST",
        body: formData,
      });
      const responseData = await response.json();
      setMessage(responseData.message || responseData.error);
      if (response.ok && responseData.imageUrl) {
        setImageUrl(responseData.imageUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while submitting the journal entry.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="form-container">
      <h1>Show Your Foodie Pictures!</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title and content fields */}

        <label htmlFor="image" className="form-label">
          Image:
        </label>
        <br />
        <input
          type="file"
          id="image"
          accept=".png, .jpg, .jpeg"
          onChange={handleImageChange}
          className="form-file-input"
        />
        <br />

        {imageUrl && (
          <div>
            <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
          </div>
        )}

        <button type="submit" className="form-submit-btn">
          Submit
        </button>
      </form>

      <div>{message}</div>
      <div className="image-gallery-container">
        <ImageGallery />
      </div>
    </div>
  );
};

export default JournalEntryForm;

