import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.atalayaresort.online/api";

const STATUSES = [
  "all",
  "pending",
  "awaiting_payment",
  "under_review",
  "confirmed",
  "cancelled",
  "rejected",
];

function formatStatus(status = "") {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount, currency = "PHP") {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const adminToken = sessionStorage.getItem("atalayaAdminToken");

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchBookings = useCallback(async () => {
    if (!adminToken) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const query = params.toString();

      const response = await fetch(
        `${API_BASE_URL}/admin/bookings${query ? `?${query}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load bookings.");
      }

      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Check your backend connection."
          : err.message || "Unable to load bookings.",
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken, handleUnauthorized, search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchBookings();
    }, 250);

    return () => clearTimeout(timeout);
  }, [fetchBookings]);

  async function updateBookingStatus(booking, status) {
    const action = formatStatus(status);

    const confirmed = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} booking ${booking.booking_reference}?`,
    );

    if (!confirmed) return;

    setUpdatingId(booking.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/bookings/${booking.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Unable to ${action.toLowerCase()} booking.`,
        );
      }

      setNotice(
        result.message || `Booking ${action.toLowerCase()} successfully.`,
      );

      await fetchBookings();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to update booking.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function logout() {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="admin-brand">
          <span className="admin-brand-name">ATALAYA</span>
          <span className="admin-brand-subtitle">RESORT MANAGEMENT</span>
        </Link>

        <nav className="admin-navigation">
          <Link to="/admin/dashboard" className="admin-nav-link">
            Dashboard
          </Link>

          <Link to="/admin/accommodations" className="admin-nav-link">
            Accommodations
          </Link>

          <Link
            to="/admin/bookings"
            className="admin-nav-link admin-nav-link-active"
          >
            Bookings
          </Link>

          <Link to="/admin/payments" className="admin-nav-link">
            Payments
          </Link>

          <Link to="/admin/settings" className="admin-nav-link">
            Settings
          </Link>
        </nav>

        <button type="button" className="admin-logout-button" onClick={logout}>
          Sign Out
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">RESERVATION MANAGEMENT</p>
            <h1>Bookings</h1>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchBookings}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <section className="admin-page-intro">
          <div>
            <h2>Guest Reservations</h2>
            <p>
              Review reservations, monitor payment progress, and manage booking
              decisions.
            </p>
          </div>

          <div className="admin-booking-count">
            <span>Total displayed</span>
            <strong>{bookings.length}</strong>
          </div>
        </section>

        <section className="admin-booking-filters">
          <div className="admin-search-wrapper">
            <label htmlFor="booking-search">Search reservations</label>

            <input
              id="booking-search"
              type="search"
              placeholder="Guest name, email or booking reference"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-status-filter">
            <label htmlFor="booking-status">Booking status</label>

            <select
              id="booking-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="admin-alert admin-alert-success" role="status">
            {notice}
          </div>
        )}

        <section className="admin-table-card">
          <div className="admin-table-heading">
            <div>
              <h2>All Reservations</h2>
              <p>Bookings received by Atalaya Resort.</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <p>Loading reservations...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No bookings found</h3>
              <p>Reservations matching your search will appear here.</p>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>Booking Reference</th>
                    <th>Guest</th>
                    <th>Stay</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => {
                    const status = booking.booking_status;
                    const canManage = [
                      "pending",
                      "awaiting_payment",
                      "under_review",
                    ].includes(status);

                    const isUpdating = updatingId === booking.id;

                    return (
                      <tr key={booking.id}>
                        <td>
                          <strong className="admin-booking-reference">
                            {booking.booking_reference || `#${booking.id}`}
                          </strong>

                          <span className="admin-table-subtext">
                            {formatDate(booking.created_at)}
                          </span>
                        </td>

                        <td>
                          <strong>{booking.guest_name || "Guest"}</strong>

                          <span className="admin-table-subtext">
                            {booking.guest_email || "No email"}
                          </span>

                          <span className="admin-table-subtext">
                            {booking.guest_phone || ""}
                          </span>
                        </td>

                        <td>
                          <span>{formatDate(booking.check_in)}</span>
                          <span className="admin-table-subtext">
                            to {formatDate(booking.check_out)}
                          </span>
                        </td>

                        <td>
                          <span>{Number(booking.adults || 0)} adults</span>
                          <span className="admin-table-subtext">
                            {Number(booking.children || 0)} children
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatMoney(
                              booking.total_amount,
                              booking.currency,
                            )}
                          </strong>
                        </td>

                        <td>
                          {formatMoney(booking.amount_paid, booking.currency)}
                        </td>

                        <td>
                          <span
                            className={`admin-status-badge admin-status-${status}`}
                          >
                            {formatStatus(status)}
                          </span>
                        </td>

                        <td>
                          <div className="admin-booking-actions">
                            {canManage && (
                              <>
                                <button
                                  type="button"
                                  className="admin-action-button admin-action-confirm"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateBookingStatus(booking, "confirmed")
                                  }
                                >
                                  Confirm
                                </button>

                                <button
                                  type="button"
                                  className="admin-action-button admin-action-reject"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateBookingStatus(booking, "rejected")
                                  }
                                >
                                  Reject
                                </button>

                                <button
                                  type="button"
                                  className="admin-action-button admin-action-cancel"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    updateBookingStatus(booking, "cancelled")
                                  }
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {isUpdating && (
                              <span className="admin-table-subtext">
                                Updating...
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminBookings;
