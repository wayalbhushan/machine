import { useEffect, useState } from "react";
import type { Medicine } from "./types";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
const [search, setSearch] = useState("");
const [medicines, setMedicines] = useState<Medicine[]>([]);
const [loading, setLoading] = useState(false);

 useEffect(() => {
   if (!search) return;
const timer = setTimeout(async () => {
      setLoading(true);

     try {
     const response = await fetch(
      `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${search}&limit=20`
        );
        if (!response.ok) {
          setMedicines([]);
          return;
        }
   const data = await response.json();
      setMedicines(data.results || []);
      } catch {
        setMedicines([]);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="app">
      <h1>Medicine Search</h1>

      <input
        type="text"  placeholder="Search medicine"  value={search} onChange={(e) => setSearch(e.target.value)}
       />

      {loading && <p>loading just wait </p>}

      {!loading && search && medicines.length === 0 && (
        <p>No results</p>
      )}

    <div className="results">
      {medicines.map((medicine, index) => (
        <Link to={`/medicine/${index}`} state={{ medicine }} className="card" key={index} >
          <h2>{medicine.openfda?.brand_name?.[0]}</h2>
          <p>Generic: {medicine.openfda?.generic_name?.[0] || "N/A"}</p>
          <p>
            Manufacturer: {medicine.openfda?.manufacturer_name?.[0] || "N/A"}
          </p>
          <p>
            Product Type: {medicine.openfda?.product_type?.[0] || "N/A"}
          </p>
          <p>Route: {medicine.openfda?.route?.[0] || "N/A"}</p>
        </Link>
      ))}
    </div>
    </div>
  );
}

export default App;