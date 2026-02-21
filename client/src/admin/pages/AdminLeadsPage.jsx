// AdminLeadsPage.jsx
import React from "react";
import LeadsTable from "../../components/LeadsTable";

const sampleLeads = [
  { name: "Ibrahim AlJanabi", email: "Barhoomi@example.com", phone: "916-916-9167", date: "Feb 19, 2026" },
  { name: "Kevin Maldonado", email: "Kevin@example.com", phone: "916-654-3210", date: "Feb 18, 2026" },
];

const AdminLeadsPage = () => {
  return (
    <div className="p-4">
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#1F2937", margin: "0 0 20px 0" }}>Leads</h1>
      <LeadsTable leads={sampleLeads} />
    </div>
  );
};

export default AdminLeadsPage;