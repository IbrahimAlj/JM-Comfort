import { useState, useEffect } from "react";

const CARDS = [
  { key: "appointmentsThisWeek", label: "Appointments This Week" },
  { key: "newLeadsThisWeek", label: "New Leads This Week" },
  { key: "completedProjects", label: "Completed Projects" },
  { key: "averageRating", label: "Average Rating" },
];

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "16px",
  marginBottom: "28px",
};

const cardStyle = {
  backgroundColor: "white",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  padding: "24px",
};

const valuePlaceholderStyle = {
  height: "40px",
  backgroundColor: "#F3F4F6",
  borderRadius: "4px",
  marginBottom: "8px",
};

const valueStyle = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#1F2937",
  margin: "0 0 6px 0",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: "500",
  color: "#6B7280",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: 0,
};

export default function AnalyticsSummaryCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/analytics/summary", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div style={containerStyle} data-testid="analytics-loading">
        {CARDS.map((card) => (
          <div key={card.key} style={cardStyle}>
            <div style={valuePlaceholderStyle} />
            <p style={labelStyle}>{card.label}</p>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p
        style={{ fontSize: "13px", color: "#DC2626", marginBottom: "28px" }}
        data-testid="analytics-error"
      >
        Unable to load analytics
      </p>
    );
  }

  return (
    <div style={containerStyle} data-testid="analytics-cards">
      {CARDS.map((card) => (
        <div key={card.key} style={cardStyle}>
          <p style={valueStyle}>
            {data && data[card.key] !== null && data[card.key] !== undefined
              ? data[card.key]
              : "N/A"}
          </p>
          <p style={labelStyle}>{card.label}</p>
        </div>
      ))}
    </div>
  );
}
