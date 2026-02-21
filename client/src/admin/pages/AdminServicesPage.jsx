import { useState, useEffect } from "react";

const EMPTY_FORM = { title: "", description: "", price: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

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

  function startEdit(service) {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || "",
    });
    setFormError("");
    setSuccessMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");

    if (!formData.title.trim()) {
      setFormError("Service title is required");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Service description is required");
      return;
    }

    setFormLoading(true);
    setFormError("");

    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: formData.price.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Failed to ${editingId ? "update" : "create"} service`);
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Services</h1>
        <p className="text-gray-500">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Services</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
        <button
          onClick={fetchServices}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Services</h1>

      {successMsg && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-800">
          {successMsg}
        </div>
      )}

      {/* Create / Edit Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-medium mb-3">
          {editingId ? "Edit Service" : "Add Service"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="e.g. Installation"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="e.g. Starting at $3,500"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={formLoading}
              rows={3}
              placeholder="Describe the service..."
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={formLoading}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services Table */}
      {services.length === 0 ? (
        <p className="text-gray-500">No services found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {service.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {service.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {service.price || "\u2014"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(service)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                      >
                        Edit
                      </button>
                      {deleteConfirm === service.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(service.id)}
                            disabled={deleteLoading}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium disabled:opacity-50"
                          >
                            {deleteLoading ? "Deleting..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirm(null);
                              setDeleteError("");
                            }}
                            disabled={deleteLoading}
                            className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700"
                          >
                            Cancel
                          </button>
                          {deleteError && (
                            <span className="text-xs text-red-600">{deleteError}</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteConfirm(service.id);
                            setDeleteError("");
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
