import { useState, useRef, useEffect, useCallback } from "react";
import { LuUpload, LuImagePlus, LuX, LuTrash2, LuLoader } from "react-icons/lu";
import { captureError } from "../../utils/captureError";
import {
  PageHeader,
  SectionCard,
  Button,
  Field,
  inputClass,
  ErrorBanner,
  SuccessBanner,
} from "../ui";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function validateFiles(files) {
  const errors = [];
  for (const file of files) {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(
        `${file.name}: File type "${ext}" is not allowed. Use jpg, jpeg, png, or webp.`
      );
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(
        `${file.name}: File size (${(file.size / (1024 * 1024)).toFixed(
          1
        )}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit.`
      );
    }
  }
  return errors;
}

export default function AdminUploadPage() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [photoType, setPhotoType] = useState("general");
  const [projectId, setProjectId] = useState("");

  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (!res.ok) {
        setGalleryError(data.error || "Failed to load images");
      } else {
        setGallery(data);
      }
    } catch {
      setGalleryError("Could not connect to server");
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  async function handleDelete() {
    if (!confirmDeleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/gallery/${confirmDeleteId}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete image");
      } else {
        setGallery((prev) => prev.filter((img) => img.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      }
    } catch {
      setDeleteError("Could not connect to server");
    } finally {
      setDeleting(false);
    }
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setResult(null);
    setError(null);
    setValidationErrors(validateFiles(files));
  }

  function removeFile(index) {
    const next = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(next);
    setValidationErrors(validateFiles(next));
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;
    const errors = validateFiles(selectedFiles);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setUploading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("photo_type", photoType);
    if (projectId) formData.append("project_id", projectId);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setResult(data);
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchGallery();
      }
    } catch (err) {
      captureError(err, { page: "AdminUpload", action: "uploadFiles" });
      setError("Could not connect to server");
    } finally {
      setUploading(false);
    }
  }

  const canSubmit =
    !uploading && selectedFiles.length > 0 && validationErrors.length === 0;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Upload Pictures"
        subtitle="Add photos to the public gallery. Tag them as before/after for project pairings."
      />

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-base font-semibold text-gray-900">Delete image?</h2>
            <p className="mb-5 text-sm text-gray-600">
              This will permanently remove the image from the gallery and cannot be undone.
            </p>
            {deleteError && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{deleteError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setConfirmDeleteId(null); setDeleteError(null); }}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting && <LuLoader size={14} className="animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <SectionCard title="New upload">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Select images
            </label>
            <label
              htmlFor="gallery-file-input"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-gray-400 hover:bg-gray-100"
            >
              <LuImagePlus size={28} className="text-gray-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">
                Click to choose or drop files here
              </span>
              <span className="text-xs text-gray-500">
                JPG, JPEG, PNG, WEBP · up to {MAX_FILE_SIZE_MB}MB each
              </span>
              <input
                id="gallery-file-input"
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Photo Type">
              <select
                value={photoType}
                onChange={(e) => setPhotoType(e.target.value)}
                className={inputClass}
              >
                <option value="general">General</option>
                <option value="before">Before</option>
                <option value="after">After</option>
              </select>
            </Field>
            <Field label="Project ID (optional)" hint="Group a before/after pair by project id.">
              <input
                type="number"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="e.g. 1"
                className={inputClass}
              />
            </Field>
          </div>

          {validationErrors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="mb-1 font-medium">Validation errors</p>
              <ul className="list-disc space-y-0.5 pl-5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
              </p>
              <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
                {selectedFiles.map((f, i) => (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center justify-between gap-3 bg-white px-3 py-2 text-sm"
                  >
                    <span className="truncate text-gray-700">{f.name}</span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {(f.size / 1024).toFixed(0)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      aria-label={`Remove ${f.name}`}
                    >
                      <LuX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <ErrorBanner>{error}</ErrorBanner>}

          {result && (
            <div className="space-y-2">
              {result.uploaded?.length > 0 && (
                <SuccessBanner>
                  {result.uploaded.length} image
                  {result.uploaded.length > 1 ? "s" : ""} uploaded successfully.
                </SuccessBanner>
              )}
              {result.failed?.length > 0 && (
                <ErrorBanner>
                  <p className="font-medium">Some files failed:</p>
                  <ul className="mt-1 list-disc pl-5">
                    {result.failed.map((f, i) => (
                      <li key={i}>
                        {f.name}: {f.error}
                      </li>
                    ))}
                  </ul>
                </ErrorBanner>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!canSubmit}
              leftIcon={<LuUpload size={16} />}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title={`Gallery (${gallery.length} image${gallery.length !== 1 ? "s" : ""})`}>
        {galleryLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <LuLoader size={24} className="animate-spin" />
          </div>
        ) : galleryError ? (
          <ErrorBanner>{galleryError}</ErrorBanner>
        ) : gallery.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {gallery.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-40 w-full object-cover"
                />
                <div className="px-2 pb-2 pt-1.5">
                  <p className="truncate text-xs text-gray-600" title={img.title}>{img.title}</p>
                  <p className="text-xs capitalize text-gray-400">{img.photo_type}{img.project_id ? ` · #${img.project_id}` : ""}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setConfirmDeleteId(img.id); setDeleteError(null); }}
                  className="absolute right-2 top-2 rounded-lg bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                  aria-label={`Delete ${img.title}`}
                >
                  <LuTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
