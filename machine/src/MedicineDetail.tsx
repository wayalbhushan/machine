import { useLocation, Link } from "react-router-dom";
import type { Medicine } from "./types";

function MedicineDetail() {
  const location = useLocation();
  const medicine = location.state?.medicine as Medicine;

  if (!medicine) {
    return (
      <div className="app">
        <p>Medicine not found</p>
        <Link to="/">search pahe</Link>
      </div>
    );
  }

  const openfda = medicine.openfda;

  return (
    <div className="app">
      <Link to="/">← Back to search</Link>

      <div className="card detail">
        <h1>{openfda?.brand_name?.[0]}</h1>

        <p>
          <strong>Generic Name:</strong>{" "}
          {openfda?.generic_name?.[0] || "N/A"}
        </p>

        <p>
          <strong>Manufacturer:</strong>{" "}
          {openfda?.manufacturer_name?.[0] || "N/A"}
        </p>

        <p>
          <strong>Product Type:</strong>{" "}
          {openfda?.product_type?.[0] || "N/A"}
        </p>

        <p>
          <strong>Route:</strong>{" "}
          {openfda?.route?.[0] || "N/A"}
        </p>
      </div>
    </div>
  );
}

export default MedicineDetail;