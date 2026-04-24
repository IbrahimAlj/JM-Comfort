import { useEffect, useState, useCallback, useMemo } from "react";
import { LuImage, LuX, LuLayoutGrid } from "react-icons/lu";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import { captureError } from "../utils/captureError";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pairs", label: "Before / After" },
  { key: "general", label: "Gallery" },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchImages = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load images");
        return res.json();
      })
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        captureError(err, { page: "Gallery", action: "fetchImages" });
        setError("Unable to load gallery images. Please try again later.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e) => e.key === "Escape" && setSelectedImage(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedImage]);

  const { pairs, general } = useMemo(() => {
    const projectGroups = {};
    const generalImages = [];

    images.forEach((img) => {
      if (
        img.project_id &&
        (img.photo_type === "before" || img.photo_type === "after")
      ) {
        if (!projectGroups[img.project_id]) projectGroups[img.project_id] = {};
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

  const showPairs = filter === "all" || filter === "pairs";
  const showGeneral = filter === "all" || filter === "general";
  const totalVisible =
    (showPairs ? pairs.length : 0) + (showGeneral ? general.length : 0);

  return (
    <>
      <PageMeta
        title="HVAC Project Gallery | JM Comfort Sacramento"
        description="Browse JM Comfort's completed HVAC installation and repair projects in Sacramento, CA. Quality craftsmanship you can see from a trusted local team."
      />
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Page header */}
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our work
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Project gallery
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Real installs and repairs from the Sacramento area — see the before, the
              after, and everything in between.
            </p>

            {!loading && !error && images.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {FILTERS.map(({ key, label }) => {
                  const active = filter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchImages}
                className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : totalVisible === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
              <LuImage
                className="mb-3 h-10 w-10 text-gray-400"
                aria-hidden="true"
              />
              <h3 className="text-base font-semibold text-gray-900">
                Nothing to show yet
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Fresh photos are on the way. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {showPairs && pairs.length > 0 && (
                <section>
                  <div className="mb-5 flex items-center gap-2">
                    <LuLayoutGrid size={18} className="text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Before &amp; After
                    </h2>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    {pairs.map((pair) => (
                      <article
                        key={`pair-${pair.projectId}`}
                        className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="grid grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setSelectedImage(pair.before.url)}
                            className="group relative block overflow-hidden"
                          >
                            <img
                              src={pair.before.url}
                              alt={`Before — ${pair.before.title || "HVAC project"}`}
                              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow">
                              Before
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedImage(pair.after.url)}
                            className="group relative block overflow-hidden border-l border-gray-200"
                          >
                            <img
                              src={pair.after.url}
                              alt={`After — ${pair.after.title || "HVAC project"}`}
                              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow">
                              After
                            </span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3 text-sm text-gray-600">
                          <span className="font-medium text-gray-800">Project</span>
                          <span className="text-gray-500">
                            Click a photo to enlarge
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {showGeneral && general.length > 0 && (
                <section>
                  <div className="mb-5 flex items-center gap-2">
                    <LuImage size={18} className="text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {general.map((img, idx) => (
                      <button
                        key={`${img.url}-${idx}`}
                        type="button"
                        onClick={() => setSelectedImage(img.url)}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <img
                          src={img.url}
                          alt={img.title || "JM Comfort HVAC project"}
                          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged project image"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view of HVAC project"
              className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg hover:bg-gray-100"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
