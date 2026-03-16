import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";

export default function Dataset() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api
      .get("/dataset/")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.detail || err.message || "Failed to load dataset")
      )
      .finally(() => setLoading(false));
  }, []);

  const filteredRows =
    data?.rows?.filter((row) => {
      if (!filter) return true;
      const make = (row.make || "").toString().toLowerCase();
      return make.includes(filter.toLowerCase());
    }) ?? [];

  return (
    <div className="page-container" id="dataset-page">
      <h1 className="section-title" style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>
        Dataset Explorer
      </h1>
      <p style={{ color: "var(--gray-500)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        Browse the UCI Automobile dataset used for training.
      </p>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading ? (
        <Spinner />
      ) : data ? (
        <>
          <div className="dataset-header">
            <div className="dataset-count">
              Showing <strong>{filteredRows.length}</strong> of{" "}
              <strong>{data.total}</strong> total records
            </div>
            <input
              type="text"
              className="search-input"
              id="filter-input"
              placeholder="Filter by manufacturer…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="data-table" id="data-table">
              <thead>
                <tr>
                  {data.columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, i) => (
                  <tr key={i}>
                    {data.columns.map((col) => (
                      <td key={col}>{row[col] ?? "—"}</td>
                    ))}
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={data.columns.length}
                      style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)" }}
                    >
                      No rows match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
