import { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../components/Navbar";
import { captureError } from "../utils/captureError";
import PageMeta from "../components/PageMeta";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load images");
        return res.json();
      })
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        captureError(err, { page: 'Gallery', action: 'fetchImages' });
        setError("Unable to load gallery images. Please try again later.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Group before/after pairs by project_id, rest go to general
  const { pairs, general } = useMemo(() => {
    const projectGroups = {};
    const generalImages = [];

    images.forEach((img) => {
      if (img.project_id && (img.photo_type === "before" || img.photo_type === "after")) {
        if (!projectGroups[img.project_id]) {
          projectGroups[img.project_id] = {};
        }
        projectGroups[img.project_id][img.photo_type] = img;
      } else {
        generalImages.push(img);
      }
    });

    const pairedList = [];
    Object.entries(projectGroups).forEach(([pid, group]) => {
      if (group.before && group.after) {
        pairedList.push({ projectId: pid, before: group.before, after: group.after });
      } else {
        if (group.before) generalImages.push(group.before);
        if (group.after) generalImages.push(group.after);
      }
    });

    return { pairs: pairedList, general: generalImages };
  }, [images]);

  return (
    <>
    <PageMeta
      title="HVAC Project Gallery | JM Comfort Sacramento"
      description="Browse JM Comfort's completed HVAC installation and repair projects in Sacramento, CA. Quality craftsmanship you can see from a trusted local team."
    />
    <Navbar />
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Our Project Gallery
      </h1>

      {/* Loading state */}
      {loading && (
        <p className="text-center text-gray-600">Loading gallery...</p>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchImages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && images.length === 0 && (
        <p className="text-center text-gray-600">
          No images in the gallery yet.
        </p>
      )}

      {/* Before/After pairs */}
      {!loading && !error && pairs.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Before & After</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {pairs.map((pair) => (
              <div
                key={`pair-${pair.projectId}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div>
                  <span style={{
                    display: "inline-block",
                    marginBottom: "8px",
                    padding: "2px 10px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#DC2626",
                    backgroundColor: "#FEF2F2",
                    borderRadius: "9999px",
                  }}>
                    Before
                  </span>
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setSelectedImage(pair.before.url)}
                  >
                    <img
                      src={pair.before.url}
                      alt={`Before - ${pair.before.title || "HVAC project"}`}
                      className="w-full h-60 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                </div>
                <div>
                  <span style={{
                    display: "inline-block",
                    marginBottom: "8px",
                    padding: "2px 10px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#16A34A",
                    backgroundColor: "#F0FDF4",
                    borderRadius: "9999px",
                  }}>
                    After
                  </span>
                  <div
                    className="cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setSelectedImage(pair.after.url)}
                  >
                    <img
                      src={pair.after.url}
                      alt={`After - ${pair.after.title || "HVAC project"}`}
                      className="w-full h-60 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General image grid */}
      {!loading && !error && general.length > 0 && (
        <div>
          {pairs.length > 0 && (
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gallery</h2>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {general.map((img, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:scale-105 transition-transform"
                onClick={() => setSelectedImage(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.title || "JM Comfort HVAC project"}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Basic modal */}
      {selectedImage && (
        <div
          role="dialog"
          aria-label="Enlarged project image"
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Enlarged view of HVAC project"
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
              className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
    </>
  );
};

export default Gallery;
