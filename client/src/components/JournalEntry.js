import React, { useState } from "react";
import ImageGallery from "./ImageGallery";

const JournalEntryForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
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
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while submitting the journal entry.");
    }
  };

  return (
    <div className="form-container">
      <h1>Show Your Foodie Pictures!</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* <label htmlFor="title" className="form-label">
          Title:
        </label>
        <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        <br />

        <label htmlFor="content" className="form-label">
          Content:
        </label>
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-textarea"
        ></textarea>
        <br /> */}

        <label htmlFor="image" className="form-label">
          Image:
        </label>
        <br />
        <input
          type="file"
          id="image"
          accept=".png, .jpg, .jpeg"
          onChange={(e) => setImage(e.target.files[0])}
          className="form-file-input"
        />
        <br />

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
