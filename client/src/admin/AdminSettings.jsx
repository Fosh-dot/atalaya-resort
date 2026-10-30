import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.atalayaresort.online/api";

const INITIAL_SETTINGS = {
  resort_name: "Atalaya Resort",
  contact_email: "",
  contact_phone: "",
  address: "",
  booking_policy: "",
  payment_instructions: "",
  bank_name: "",
  account_name: "",
  account_number: "",
  account_currency: "PHP",
};

function AdminSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const adminToken = sessionStorage.getItem("atalayaAdminToken");

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadSettings = useCallback(async () => {
    if (!adminToken) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load settings.");
      }

      setSettings({
        ...INITIAL_SETTINGS,
        ...(result.data || {}),
      });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to load settings.",
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken, handleUnauthorized]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSettings() {
      if (!adminToken) {
        handleUnauthorized();
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          handleUnauthorized();
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load settings.");
        }

        setSettings({
          ...INITIAL_SETTINGS,
          ...(result.data || {}),
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to the server."
            : err.message || "Unable to load settings.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => controller.abort();
  }, [adminToken, handleUnauthorized]);

  function handleChange(event) {
    const { name, value } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));

    setNotice("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!adminToken) {
      handleUnauthorized();
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save settings.");
      }

      if (result.data) {
        setSettings((previous) => ({
          ...previous,
          ...result.data,
        }));
      }

      setNotice(result.message || "Settings saved successfully.");
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to save settings.",
      );
    } finally {
      setSaving(false);
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

          <Link to="/admin/bookings" className="admin-nav-link">
            Bookings
          </Link>

          <Link to="/admin/payments" className="admin-nav-link">
            Payments
          </Link>

          <Link
            to="/admin/settings"
            className="admin-nav-link admin-nav-link-active"
          >
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
            <p className="admin-eyebrow">RESORT CONFIGURATION</p>
            <h1>Settings</h1>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadSettings}
            disabled={loading || saving}
          >
            Refresh
          </button>
        </header>

        <section className="admin-page-intro">
          <div>
            <h2>Resort Settings</h2>
            <p>
              Manage resort contact information, booking policies, and manual
              payment instructions.
            </p>
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

        {loading ? (
          <div className="admin-table-card admin-settings-loading">
            Loading resort settings...
          </div>
        ) : (
          <form className="admin-settings-form" onSubmit={handleSubmit}>
            <section className="admin-settings-card">
              <div className="admin-settings-card-heading">
                <h2>Resort Information</h2>
                <p>Contact information displayed to guests.</p>
              </div>

              <div className="admin-settings-grid">
                <div className="admin-settings-field">
                  <label htmlFor="resort_name">Resort name</label>
                  <input
                    id="resort_name"
                    name="resort_name"
                    value={settings.resort_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="contact_email">Contact email</label>
                  <input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="contact_phone">Contact phone</label>
                  <input
                    id="contact_phone"
                    name="contact_phone"
                    type="tel"
                    value={settings.contact_phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="address">Resort address</label>
                  <input
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-card-heading">
                <h2>Booking Policies</h2>
                <p>
                  Maintain the booking policy information used by the resort.
                </p>
              </div>

              <div className="admin-settings-field">
                <label htmlFor="booking_policy">Booking policy</label>
                <textarea
                  id="booking_policy"
                  name="booking_policy"
                  rows="6"
                  value={settings.booking_policy}
                  onChange={handleChange}
                  placeholder="Enter the resort's approved booking policies..."
                />
              </div>
            </section>

            <section className="admin-settings-card">
              <div className="admin-settings-card-heading">
                <h2>Manual Payment Settings</h2>
                <p>
                  Configure the payment instructions and account details guests
                  should use.
                </p>
              </div>

              <div className="admin-settings-field">
                <label htmlFor="payment_instructions">
                  Payment instructions
                </label>
                <textarea
                  id="payment_instructions"
                  name="payment_instructions"
                  rows="4"
                  value={settings.payment_instructions}
                  onChange={handleChange}
                  placeholder="Enter the approved payment instructions..."
                />
              </div>

              <div className="admin-settings-grid">
                <div className="admin-settings-field">
                  <label htmlFor="bank_name">Bank or payment provider</label>
                  <input
                    id="bank_name"
                    name="bank_name"
                    value={settings.bank_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="account_name">Account name</label>
                  <input
                    id="account_name"
                    name="account_name"
                    value={settings.account_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="account_number">Account number</label>
                  <input
                    id="account_number"
                    name="account_number"
                    value={settings.account_number}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-settings-field">
                  <label htmlFor="account_currency">Payment currency</label>
                  <select
                    id="account_currency"
                    name="account_currency"
                    value={settings.account_currency}
                    onChange={handleChange}
                  >
                    <option value="PHP">PHP — Philippine Peso</option>
                    <option value="USD">USD — US Dollar</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="admin-settings-footer">
              <p>
                Review changes before saving. Payment details should match the
                resort's approved account.
              </p>

              <button
                type="submit"
                className="admin-settings-save-button"
                disabled={saving}
              >
                {saving ? "Saving Settings..." : "Save Settings"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default AdminSettings;
