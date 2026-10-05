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

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setMedicines([]);
      setError(null);
      return;
    }

    const query = trimmedSearch.toLowerCase();

    if (cache[query]) {
      setMedicines(cache[query]);
      setError(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(query)}&limit=20`
        );
      if (!response.ok) {
      setMedicines([]);
     setError("Error occured");
          return;
        }

    const data = (await response.json()) as { results?: Medicine[] };
  const results = data.results ?? [];

        cache[query] = results;
        setMedicines(results);
      } catch {
        setMedicines([]);
        setError("Something went wrong while loading medicines.");
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

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && search.trim() && medicines.length === 0 && (
        <p>No results</p>
      )}

      <div className="results">
        {medicines.map((medicine, index) => (
          <Link
            to={`/medicine/${index}`}
            key={index}
            onClick={() =>
              localStorage.setItem("medicine", JSON.stringify(medicine))
            }
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