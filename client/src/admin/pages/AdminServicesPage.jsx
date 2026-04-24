import { useState, useEffect, useRef } from "react";
import {
  LuPencil,
  LuTrash2,
  LuImagePlus,
  LuX,
  LuWrench,
} from "react-icons/lu";
import {
  PageHeader,
  SectionCard,
  Table,
  TH,
  TD,
  Button,
  Field,
  inputClass,
  ErrorBanner,
  SuccessBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const EMPTY_FORM = { title: "", description: "", price: "" };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function fetchServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message || "Could not load services");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_IMAGE_BYTES) {
      setFormError("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    if (formError) setFormError("");
  }

  function clearImageSelection() {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEdit(service) {
    setEditingId(service.id);
    setFormData({
      title: service.title || service.name || "",
      description: service.description || service.full_description || "",
      price: service.price || service.price_description || "",
    });
    setCurrentImageUrl(service.image_url || service.image || "");
    clearImageSelection();
    setFormError("");
    setSuccessMsg("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setCurrentImageUrl("");
    clearImageSelection();
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");

    if (!formData.title.trim()) return setFormError("Service title is required");
    if (!formData.description.trim())
      return setFormError("Service description is required");

    setFormLoading(true);
    setFormError("");

    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";
      const body = new FormData();
      body.append("title", formData.title.trim());
      body.append("description", formData.description.trim());
      body.append("price", formData.price.trim());
      if (imageFile) body.append("image", imageFile);

      const res = await fetch(url, { method, body });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail =
          data?.details?.[0]?.message ||
          (Array.isArray(data?.details) ? data.details[0] : null) ||
          data?.error;
        throw new Error(
          detail || `Failed to ${editingId ? "update" : "create"} service`
        );
      }
      const data = await res.json();
      if (editingId) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingId ? data.service : s))
        );
        setSuccessMsg("Service updated successfully");
      } else {
        setServices((prev) => [data.service, ...prev]);
        setSuccessMsg("Service created successfully");
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setCurrentImageUrl("");
      clearImageSelection();
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    setDeleteLoading(true);
    setDeleteError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete service");
      }
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
      setSuccessMsg("Service deleted successfully");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Manage the HVAC services displayed publicly on the website."
      />

      {successMsg && (
        <div className="mb-4">
          <SuccessBanner>{successMsg}</SuccessBanner>
        </div>
      )}

      <SectionCard
        className="mb-6"
        title={editingId ? "Edit service" : "Add a service"}
        description={
          editingId
            ? "Update the details below and save changes."
            : "Fill in the details to add a new service to the catalog."
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" required>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="e.g. Installation"
                className={inputClass}
              />
            </Field>
            <Field label="Price" hint="Shown as-is on the site.">
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="e.g. Starting at $3,500"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={formLoading}
              rows={4}
              placeholder="Describe the service..."
              className={inputClass}
            />
          </Field>

          <Field label="Photo" hint="Optional. JPG/PNG/WEBP, max 5MB.">
            <div className="flex flex-wrap items-center gap-4">
              <label
                htmlFor="service-photo-input"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <LuImagePlus size={16} /> Choose file
                <input
                  id="service-photo-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={formLoading}
                  className="sr-only"
                />
              </label>
              {imageFile && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="truncate max-w-[200px]">{imageFile.name}</span>
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                    aria-label="Remove selection"
                  >
                    <LuX size={14} />
                  </button>
                </div>
              )}
            </div>
            {(imagePreview || currentImageUrl) && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={imagePreview || currentImageUrl}
                  alt="Service preview"
                  className="h-24 w-24 rounded-lg border border-gray-200 object-cover"
                />
                <p className="text-xs text-gray-500">
                  {imagePreview
                    ? "New photo will replace current on save."
                    : "Current photo"}
                </p>
              </div>
            )}
          </Field>

          {formError && <ErrorBanner>{formError}</ErrorBanner>}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {editingId && (
              <Button
                type="button"
                variant="secondary"
                onClick={cancelEdit}
                disabled={formLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={formLoading}>
              {formLoading
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update service"
                  : "Add service"}
            </Button>
          </div>
        </form>
      </SectionCard>

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchServices}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading services...
          </div>
        </Card>
      ) : services.length === 0 ? (
        <EmptyState
          icon={<LuWrench size={22} />}
          title="No services yet"
          description="Add your first service using the form above."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Photo</TH>
              <TH>Title</TH>
              <TH>Description</TH>
              <TH>Price</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => {
              const title = service.title || service.name;
              const description =
                service.description || service.full_description || "";
              const priceLabel = service.price || service.price_description;
              const img = service.image_url || service.image;
              return (
                <tr key={service.id} className="hover:bg-gray-50">
                  <TD>
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        <LuImagePlus size={16} />
                      </div>
                    )}
                  </TD>
                  <TD className="font-medium text-gray-900">{title}</TD>
                  <TD className="max-w-[360px]">
                    <p className="line-clamp-2 text-gray-600">{description}</p>
                  </TD>
                  <TD className="whitespace-nowrap text-gray-600">
                    {priceLabel || "—"}
                  </TD>
                  <TD>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<LuPencil size={14} />}
                        onClick={() => startEdit(service)}
                      >
                        Edit
                      </Button>
                      {deleteConfirm === service.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(service.id)}
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? "Deleting..." : "Confirm"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setDeleteConfirm(null);
                              setDeleteError("");
                            }}
                            disabled={deleteLoading}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<LuTrash2 size={14} />}
                          onClick={() => {
                            setDeleteConfirm(service.id);
                            setDeleteError("");
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    {deleteError && deleteConfirm === service.id && (
                      <p className="mt-1 text-right text-xs text-red-600">
                        {deleteError}
                      </p>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
