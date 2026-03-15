const API_BASE = "http://localhost:8000/api";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchData() {
  const res = await fetch(`${API_BASE}/data`);
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return res.json();
}

export async function fetchOptions() {
  const res = await fetch(`${API_BASE}/options`);
  return res.json();
}

export async function fetchBrands() {
  const res = await fetch(`${API_BASE}/brands`);
  return res.json();
}

export async function fetchBodyTypes() {
  const res = await fetch(`${API_BASE}/body-types`);
  return res.json();
}

export async function fetchSegments() {
  const res = await fetch(`${API_BASE}/segments`);
  return res.json();
}

export async function fetchScatter(feature) {
  const res = await fetch(`${API_BASE}/scatter/${feature}`);
  return res.json();
}

export async function predictPrice(data) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export function formatINR(num) {
  if (num == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
