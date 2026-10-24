import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.token) {
        throw new Error(result.message || "Unable to sign in.");
      }

      sessionStorage.setItem("atalayaAdminToken", result.data.token);
      sessionStorage.setItem("atalayaAdmin", JSON.stringify(result.data.admin));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Check that the backend is running."
          : err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brand-mark">A</span>

          <div>
            <h1>ATALAYA</h1>
            <p>RESORT · PALAWAN</p>
          </div>
        </div>

        <div className="admin-login-heading">
          <span className="admin-eyebrow">ADMINISTRATION</span>
          <h2>Welcome back</h2>
          <p>Sign in to manage your resort.</p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email address</label>

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="Enter your admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>

        <p className="admin-login-footer">
          Secure administrator access · Atalaya Resort
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
