import React, { useState, useEffect } from "react";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetch("/uploads/journal_images")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image URLs");
        }
        return response.json();
      })
      .then((data) => {
        setImageUrls(data.image_urls || []);
      })
      .catch((error) => {
        console.error("Error fetching image URLs:", error);
      });
  }, []);

  return (
    <div>
      <h2>Image Gallery</h2>
      <div className="image-container">
        {imageUrls.map(
          (
            imageUrl,
            index // Change parameter name to imageUrl
          ) => (
            <img
              key={index}
              src={`/uploads/journal_images/${imageUrl}`}
              alt={` ${index}`}
             
            />
          )
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
