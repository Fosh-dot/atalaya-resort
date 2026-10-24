import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminToken] = useState(() =>
    sessionStorage.getItem("atalayaAdminToken"),
  );

  const [storedAdmin] = useState(() => sessionStorage.getItem("atalayaAdmin"));

  const [stats, setStats] = useState({
    bookings: 0,
    pendingBookings: 0,
    accommodations: 0,
    payments: 0,
    pendingPayments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!adminToken || !storedAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [adminToken, storedAdmin, navigate]);

  useEffect(() => {
    if (!adminToken || !storedAdmin) return;

    let cancelled = false;

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${adminToken}`,
        };

        const endpoints = [
          "/admin/bookings",
          "/admin/accommodations",
          "/admin/payments",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(`${API_BASE_URL}${endpoint}`, { headers }),
          ),
        );

        const results = await Promise.all(
          responses.map(async (response) => {
            const data = await response.json();

            if (!response.ok || data.success === false) {
              throw new Error(
                data.message || "Unable to load dashboard information.",
              );
            }

            return data;
          }),
        );

        const bookingsData = results[0];
        const accommodationsData = results[1];
        const paymentsData = results[2];

        const bookings = Array.isArray(bookingsData.data)
          ? bookingsData.data
          : [];

        const accommodations = Array.isArray(accommodationsData.data)
          ? accommodationsData.data
          : [];

        const payments = Array.isArray(paymentsData.data)
          ? paymentsData.data
          : [];

        if (!cancelled) {
          setStats({
            bookings: bookings.length,

            pendingBookings: bookings.filter((booking) =>
              ["pending", "awaiting_payment", "under_review"].includes(
                String(booking.booking_status || "").toLowerCase(),
              ),
            ).length,

            accommodations: accommodations.length,

            payments: payments.length,

            pendingPayments: payments.filter((payment) =>
              ["pending", "under_review"].includes(
                String(payment.payment_status || "").toLowerCase(),
              ),
            ).length,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load dashboard information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [adminToken, storedAdmin]);

  if (!adminToken || !storedAdmin) {
    return null;
  }

  let admin;

  try {
    admin = JSON.parse(storedAdmin);

    if (!admin || typeof admin !== "object" || Array.isArray(admin)) {
      throw new Error("Invalid admin data");
    }
  } catch {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
    return null;
  }

  function handleLogout() {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }

  const dashboardSections = [
    {
      number: "01",
      title: "Accommodation inventory",
      description: "Register and manage physical rooms and villas.",
      path: "/admin/accommodations",
    },
    {
      number: "02",
      title: "Bookings",
      description: "Review reservations and booking requests.",
      path: "/admin/bookings",
    },
    {
      number: "03",
      title: "Payments",
      description: "Review submitted payment slips and payment records.",
      path: "/admin/payments",
    },
    {
      number: "04",
      title: "Settings",
      description: "Manage resort booking and payment settings.",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-mark">A</span>

          <div>
            <strong>ATALAYA</strong>
            <span>RESORT MANAGEMENT</span>
          </div>
        </div>

        <div className="admin-sidebar-label">WORKSPACE</div>

        <button
          type="button"
          className="admin-nav-item active"
          onClick={() => navigate("/admin/dashboard")}
        >
          <span>◫</span>
          Dashboard
        </button>

        <button
          type="button"
          className="admin-nav-item"
          onClick={() => navigate("/admin/accommodations")}
        >
          <span>⌂</span>
          Accommodation inventory
        </button>

        <button
          type="button"
          className="admin-nav-item"
          onClick={() => navigate("/admin/bookings")}
        >
          <span>▤</span>
          Bookings
        </button>

        <button
          type="button"
          className="admin-nav-item"
          onClick={() => navigate("/admin/payments")}
        >
          <span>◇</span>
          Payments
        </button>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">
              {(admin.email || "A").charAt(0).toUpperCase()}
            </div>

            <div className="admin-profile-details">
              <strong>Administrator</strong>
              <span>{admin.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-dashboard-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">RESORT MANAGEMENT</span>
            <h1>Dashboard</h1>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-status-dot" />
            Administrator
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <span className="admin-eyebrow">YOUR WORKSPACE</span>
            <h2>Welcome to Atalaya.</h2>
            <p>
              Manage accommodation inventory, reservations, and payments from
              one place.
            </p>
          </div>

          <div className="admin-welcome-decoration">A</div>
        </section>

        {error && (
          <div className="admin-dashboard-error" role="alert">
            <strong>Unable to load dashboard data.</strong>
            <p>{error}</p>
          </div>
        )}

        <section className="admin-section-heading">
          <div>
            <span className="admin-eyebrow">LIVE OVERVIEW</span>
            <h2>Resort activity</h2>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => window.location.reload()}
          >
            Refresh data ↻
          </button>
        </section>

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <span>Total bookings</span>
            <strong>{loading ? "—" : stats.bookings}</strong>
            <small>Recorded reservations</small>
          </article>

          <article className="admin-stat-card">
            <span>Bookings to review</span>
            <strong>{loading ? "—" : stats.pendingBookings}</strong>
            <small>Pending, awaiting payment or under review</small>
          </article>

          <article className="admin-stat-card">
            <span>Accommodations</span>
            <strong>{loading ? "—" : stats.accommodations}</strong>
            <small>Accommodation records</small>
          </article>

          <article className="admin-stat-card">
            <span>Payments to review</span>
            <strong>{loading ? "—" : stats.pendingPayments}</strong>
            <small>Pending or under-review payments</small>
          </article>
        </section>

        <section className="admin-section-heading admin-tools-heading">
          <div>
            <span className="admin-eyebrow">MANAGEMENT TOOLS</span>
            <h2>Quick access</h2>
          </div>

          <span className="admin-tool-count">04 MODULES</span>
        </section>

        <section className="admin-module-grid">
          {dashboardSections.map((section) => (
            <button
              key={section.number}
              type="button"
              className="admin-module-card"
              onClick={() => navigate(section.path)}
            >
              <span className="admin-module-number">{section.number}</span>
              <h3>{section.title}</h3>
              <p>{section.description}</p>

              <span className="admin-module-link">
                Open module <span>→</span>
              </span>
            </button>
          ))}
        </section>

        <footer className="admin-dashboard-footer">
          ATALAYA RESORT · PALAWAN, PHILIPPINES
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;
