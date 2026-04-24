import { useState, useEffect } from "react";
import { LuPencil, LuTrash2, LuFolderKanban } from "react-icons/lu";
import {
  PageHeader,
  SectionCard,
  Table,
  TH,
  TD,
  Pill,
  Button,
  Field,
  inputClass,
  ErrorBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const STATUS_OPTIONS = ["planned", "in_progress", "completed", "cancelled"];
const STATUS_TONE = {
  planned: "blue",
  in_progress: "yellow",
  completed: "green",
  cancelled: "slate",
};

const EMPTY_FORM = {
  name: "",
  customer_id: "",
  status: "planned",
  start_date: "",
  end_date: "",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message || "Could not load projects");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  function startEdit(project) {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      customer_id: project.customer_id,
      status: project.status,
      start_date: project.start_date ? project.start_date.split("T")[0] : "",
      end_date: project.end_date ? project.end_date.split("T")[0] : "",
    });
    setFormError("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim()) return setFormError("Project name is required");
    if (!formData.customer_id) return setFormError("Customer ID is required");

    setFormLoading(true);
    setFormError("");

    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          customer_id: Number(formData.customer_id),
          status: formData.status,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error || `Failed to ${editingId ? "update" : "create"} project`
        );
      }

      const data = await res.json();
      if (editingId) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? data.project : p))
        );
      } else {
        setProjects((prev) => [data.project, ...prev]);
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
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to delete project");
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Track scheduled and in-progress installations and repairs."
      />

      <SectionCard
        className="mb-6"
        title={editingId ? "Edit project" : "Create project"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project Name" required>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={formLoading}
                placeholder="e.g. HVAC Installation"
                className={inputClass}
              />
            </Field>
            <Field label="Customer ID" required>
              <input
                type="number"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                disabled={formLoading || !!editingId}
                placeholder="e.g. 1"
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Start Date">
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
          </div>

          {formError && <ErrorBanner>{formError}</ErrorBanner>}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit} disabled={formLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={formLoading}>
              {formLoading
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update project"
                  : "Create project"}
            </Button>
          </div>
        </form>
      </SectionCard>

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchProjects}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading projects...
          </div>
        </Card>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<LuFolderKanban size={22} />}
          title="No projects yet"
          description="Create a project to start tracking its status and timeline."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Name</TH>
              <TH>Customer</TH>
              <TH>Status</TH>
              <TH>Start</TH>
              <TH>End</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <TD className="font-medium text-gray-900">{project.name}</TD>
                <TD>{project.customer_name || `#${project.customer_id}`}</TD>
                <TD>
                  <Pill tone={STATUS_TONE[project.status] || "gray"}>
                    {project.status.replace("_", " ")}
                  </Pill>
                </TD>
                <TD className="whitespace-nowrap text-gray-600">
                  {formatDate(project.start_date)}
                </TD>
                <TD className="whitespace-nowrap text-gray-600">
                  {formatDate(project.end_date)}
                </TD>
                <TD>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<LuPencil size={14} />}
                      onClick={() => startEdit(project)}
                    >
                      Edit
                    </Button>
                    {deleteConfirm === project.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(project.id)}
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
                          setDeleteConfirm(project.id);
                          setDeleteError("");
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  {deleteError && deleteConfirm === project.id && (
                    <p className="mt-1 text-right text-xs text-red-600">{deleteError}</p>
                  )}
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
