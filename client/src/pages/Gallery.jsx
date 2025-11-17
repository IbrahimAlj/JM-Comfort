import React, { useEffect, useState } from "react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch images using built-in fetch()
  useEffect(() => {
    fetch("http://localhost:5000/api/projects/gallery") // adjust if needed
      .then((res) => res.json())
      .then((data) => setImages(data))
      .catch((err) => console.error("Failed to load images:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Our Project Gallery
      </h1>

      {/* Image grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:scale-105 transition-transform"
            onClick={() => setSelectedImage(img.url)}
          >
            <img
              src={img.url}
              alt={img.title || "Project Image"}
              className="w-full h-60 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Basic modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged project"
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
