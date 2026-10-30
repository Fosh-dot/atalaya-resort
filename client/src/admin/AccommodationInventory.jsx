import { useCallback, useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.atalayaresort.online/api";

const styles = {
  page: {
    padding: "32px",
    color: "#26352b",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "28px",
    margin: "0 0 8px",
    fontWeight: "600",
  },
  subtitle: {
    color: "#777",
    margin: "0 0 28px",
    lineHeight: "1.6",
  },
  panel: {
    background: "#fff",
    border: "1px solid #e8ebe6",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.03)",
  },
  panelHeading: {
    fontSize: "19px",
    margin: "0 0 20px",
    fontWeight: "600",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    alignItems: "end",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #dce1d9",
    borderRadius: "7px",
    fontSize: "14px",
    outlineColor: "#71854d",
    background: "#fff",
  },
  primaryButton: {
    background: "#52683b",
    color: "#fff",
    border: "none",
    padding: "13px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  secondaryButton: {
    background: "#fff",
    color: "#52683b",
    border: "1px solid #52683b",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    background: "#f6f7f3",
    color: "#596253",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid #e8ebe6",
  },
  td: {
    padding: "16px 12px",
    fontSize: "14px",
    borderBottom: "1px solid #edf0eb",
  },
  message: {
    padding: "13px 16px",
    borderRadius: "7px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};

function getStoredToken() {
  return sessionStorage.getItem("atalayaAdminToken");
}

async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      "Your admin session may have expired or you do not have permission. Sign in again if necessary.",
    );
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "The request could not be completed.");
  }

  return result;
}

function getStatusLabel(status) {
  return String(status || "available")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusColor(status) {
  const value = String(status || "").toLowerCase();

  if (value === "available" || value === "active") {
    return { background: "#e8f4e8", color: "#28733b" };
  }

  if (value === "occupied" || value === "booked") {
    return { background: "#fff1d8", color: "#966314" };
  }

  if (
    value === "maintenance" ||
    value === "unavailable" ||
    value === "inactive"
  ) {
    return { background: "#fbe8e7", color: "#a3332c" };
  }

  return { background: "#edf0eb", color: "#52604e" };
}

function AccommodationInventory() {
  const [units, setUnits] = useState([]);
  const [accommodations, setAccommodations] = useState([]);

  const [accommodationId, setAccommodationId] = useState("");
  const [unitName, setUnitName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [unitResult, accommodationResult] = await Promise.all([
        apiRequest("/admin/accommodation-units"),
        apiRequest("/accommodations"),
      ]);

      const unitData = unitResult.data;
      const accommodationData = accommodationResult.data;

      setUnits(Array.isArray(unitData) ? unitData : unitData?.units || []);
      setAccommodations(
        Array.isArray(accommodationData)
          ? accommodationData
          : accommodationData?.accommodations || [],
      );
    } catch (err) {
      setError(err.message || "Unable to load accommodation inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInventory() {
      setLoading(true);
      setError("");

      try {
        const [unitResult, accommodationResult] = await Promise.all([
          apiRequest("/admin/accommodation-units"),
          apiRequest("/accommodations"),
        ]);

        if (cancelled) return;

        const unitData = unitResult.data;
        const accommodationData = accommodationResult.data;

        setUnits(Array.isArray(unitData) ? unitData : unitData?.units || []);

        setAccommodations(
          Array.isArray(accommodationData)
            ? accommodationData
            : accommodationData?.accommodations || [],
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load accommodation inventory.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddUnit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!accommodationId || !unitName.trim()) {
      setError("Select an accommodation and enter a unit name.");
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest("/admin/accommodation-units", {
        method: "POST",
        body: JSON.stringify({
          accommodation_id: Number(accommodationId),
          unit_name: unitName.trim(),
        }),
      });

      setSuccess(result.message || "Accommodation unit added successfully.");
      setUnitName("");
      await loadInventory();
    } catch (err) {
      setError(err.message || "Unable to add accommodation unit.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(unit) {
    setError("");
    setSuccess("");

    const currentStatus = String(unit.unit_status || "available").toLowerCase();

    const nextStatus =
      currentStatus === "available" ? "maintenance" : "available";

    const confirmed = window.confirm(
      `Change "${unit.unit_name}" to "${nextStatus}"?`,
    );

    if (!confirmed) return;

    setUpdatingId(unit.id);

    try {
      const result = await apiRequest(
        `/admin/accommodation-units/${unit.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ unit_status: nextStatus }),
        },
      );

      setSuccess(result.message || "Accommodation unit status updated.");
      await loadInventory();
    } catch (err) {
      setError(err.message || "Unable to update unit status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const availableCount = units.filter(
    (unit) => String(unit.unit_status).toLowerCase() === "available",
  ).length;

  const maintenanceCount = units.filter(
    (unit) => String(unit.unit_status).toLowerCase() === "maintenance",
  ).length;

  return (
    <main style={styles.page}>
      <header>
        <p
          style={{
            color: "#71854d",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          ATALAYA RESORT · ADMINISTRATION
        </p>

        <h1 style={styles.heading}>Accommodation Inventory</h1>

        <p style={styles.subtitle}>
          Register and manage the resort's individual rooms and villas.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          style={{
            ...styles.message,
            background: "#fbe8e7",
            color: "#a3332c",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          style={{
            ...styles.message,
            background: "#e8f4e8",
            color: "#28733b",
          }}
        >
          {success}
        </div>
      )}

      <section style={styles.panel}>
        <h2 style={styles.panelHeading}>Inventory Overview</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              label: "Registered Units",
              value: units.length,
            },
            {
              label: "Available Units",
              value: availableCount,
            },
            {
              label: "Under Maintenance",
              value: maintenanceCount,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "20px",
                borderRadius: "9px",
                background: "#f6f7f3",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#777",
                  margin: "0 0 12px",
                }}
              >
                {item.label}
              </p>

              <strong style={{ fontSize: "28px", color: "#52683b" }}>
                {loading ? "—" : item.value}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelHeading}>Register an Accommodation Unit</h2>

        <p
          style={{
            fontSize: "13px",
            color: "#777",
            lineHeight: "1.6",
            marginTop: "-10px",
            marginBottom: "22px",
          }}
        >
          Add an actual physical room or villa belonging to an existing
          accommodation category.
        </p>

        <form onSubmit={handleAddUnit}>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label} htmlFor="accommodation-category">
                Accommodation Category
              </label>

              <select
                id="accommodation-category"
                style={styles.input}
                value={accommodationId}
                onChange={(event) => setAccommodationId(event.target.value)}
                required
              >
                <option value="">Select accommodation</option>

                {accommodations.map((accommodation) => (
                  <option key={accommodation.id} value={accommodation.id}>
                    {accommodation.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label} htmlFor="unit-name">
                Physical Unit Name
              </label>

              <input
                id="unit-name"
                type="text"
                style={styles.input}
                placeholder="Enter the actual room or villa name"
                value={unitName}
                onChange={(event) => setUnitName(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                opacity: saving ? 0.7 : 1,
              }}
              disabled={saving || loading}
            >
              {saving ? "Adding Unit..." : "+ Add Unit"}
            </button>
          </div>
        </form>

        {accommodations.length === 0 && !loading && !error && (
          <p
            style={{
              color: "#966314",
              fontSize: "13px",
              marginTop: "16px",
            }}
          >
            No accommodation categories were returned by the API. Check that
            your published accommodations are available before registering
            units.
          </p>
        )}
      </section>

      <section style={styles.panel}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ ...styles.panelHeading, margin: 0 }}>
            Registered Units
          </h2>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={loadInventory}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Inventory"}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#777" }}>Loading accommodation inventory...</p>
        ) : units.length === 0 ? (
          <div
            style={{
              padding: "35px 15px",
              textAlign: "center",
              background: "#fafbf8",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ fontSize: "17px", marginBottom: "8px" }}>
              No accommodation units registered
            </h3>

            <p style={{ color: "#777", fontSize: "14px", margin: 0 }}>
              Add verified physical rooms or villas using the form above.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Unit ID</th>
                  <th style={styles.th}>Unit Name</th>
                  <th style={styles.th}>Accommodation ID</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td style={styles.td}>#{unit.id}</td>

                    <td style={{ ...styles.td, fontWeight: "600" }}>
                      {unit.unit_name}
                    </td>

                    <td style={styles.td}>{unit.accommodation_id ?? "—"}</td>

                    <td style={styles.td}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          ...getStatusColor(unit.unit_status),
                        }}
                      >
                        {getStatusLabel(unit.unit_status)}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <button
                        type="button"
                        style={styles.secondaryButton}
                        disabled={updatingId === unit.id}
                        onClick={() => handleStatusChange(unit)}
                      >
                        {updatingId === unit.id
                          ? "Updating..."
                          : String(unit.unit_status).toLowerCase() ===
                              "available"
                            ? "Mark Maintenance"
                            : "Mark Available"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AccommodationInventory;
