import { useState, useRef } from "react";
import { LuUpload, LuImagePlus, LuX } from "react-icons/lu";
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
    </div>
  );
}
