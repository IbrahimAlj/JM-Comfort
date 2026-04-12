import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetch(`/api/services/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!mounted) return;
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data) setService(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Unknown error");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <div role="status">Loading service...</div>;
  }

  if (notFound) {
    return <div role="alert">Service not found</div>;
  }

  if (error) {
    return <div role="alert">Error loading service: {error}</div>;
  }

  if (!service) {
    return <div role="alert">Service not found</div>;
  }

  return (
    <div>
      <h1>{service.name}</h1>
      <img
        src={service.image}
        alt={service.name}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <p>{service.description}</p>
    </div>
  );
}