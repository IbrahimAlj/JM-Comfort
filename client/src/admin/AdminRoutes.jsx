import { Routes, Route, Navigate } from "react-router-dom";
import Protected from "./Protected";
import AdminLogin from "./pages/AdminLogin";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AdminNotFound from "./pages/AdminNotFound";
import AdminLayout from "./AdminLayout";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminAppointmentsPage from "./pages/AdminAppointmentsPage";
import AdminServicesPage from "./pages/AdminServicesPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import AdminReviewsPage from "./pages/AdminReviewsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUploadPage from "./pages/AdminUploadPage";
import AdminAvailabilityPage from "./pages/AdminAvailabilityPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route element={<Protected />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload" element={<AdminUploadPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="appointments" element={<AdminAppointmentsPage />} />
          <Route path="availability" element={<AdminAvailabilityPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
