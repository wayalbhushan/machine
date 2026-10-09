import { useEffect, useState } from "react";
import type { Medicine } from "./types";
import { Link } from "react-router-dom";
import "./App.css";

const cache: Record<string, Medicine[]> = {};

function App() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setMedicines([]);
      setError(null);
      return;
    }

    const q = trimmed.toLowerCase();


    if (cache[q]) {
      setMedicines(cache[q]);
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(
            q
          )}&limit=20`
        );
      setRecentSearches((prev) => [q, ...prev.filter((s) => s !== q)].slice(0, 5));

        if (!resp.ok) {
          setMedicines([]);
          setError("Error occurred");
          return;
        }
        const data = (await resp.json()) as { results?: Medicine[] };
        const results = data.results ?? [];
        cache[q] = results;
        setMedicines(results);
      } catch {
        setMedicines([]);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="app">
      <h1>Medicine Search</h1>

      <input
        type="text"
        placeholder="Search medicine"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          {recentSearches.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSearch(item);
                setRecentSearches((prev) => [item, ...prev.filter((s) => s !== item)].slice(0, 5));
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )} 

      {loading && <p>Loading</p>}
      {error && <p>{error}</p>}
      {!loading && !error && search && medicines.length === 0 && (
        <p>No results found</p>
      )}

      <div className="results">
        {medicines.map((medicine, idx) => (
          <Link
            to={`/medicine/${idx}`}
            key={idx}
            onClick={() => localStorage.setItem("medicine", JSON.stringify(medicine))}
          >
            <h2>{medicine.openfda?.brand_name?.[0] ?? "Unknown brand"}</h2>
            <p>Generic: {medicine.openfda?.generic_name?.[0] || "N/A"}</p>
            <p>Manufacturer: {medicine.openfda?.manufacturer_name?.[0] || "N/A"}</p>
            <p>Product Type: {medicine.openfda?.product_type?.[0] || "N/A"}</p>
            <p>How to take: {medicine.openfda?.route?.[0] || "N/A"}</p>
            <hr />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default App;
