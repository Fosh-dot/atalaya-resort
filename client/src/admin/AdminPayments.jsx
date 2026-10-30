import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.atalayaresort.online/api";

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
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function AdminPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [rejectingPayment, setRejectingPayment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const adminToken = sessionStorage.getItem("atalayaAdminToken");

  const handleUnauthorized = useCallback(() => {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const fetchPayments = useCallback(async () => {
    if (!adminToken) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/payments`, {
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
        throw new Error(result.message || "Unable to load payments.");
      }

      setPayments(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Check your backend connection."
          : err.message || "Unable to load payments.",
      );
    } finally {
      setLoading(false);
    }
  }, [adminToken, handleUnauthorized]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPayments() {
      if (!adminToken) {
        handleUnauthorized();
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/admin/payments`, {
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
          throw new Error(result.message || "Unable to load payments.");
        }

        setPayments(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(
          err.message === "Failed to fetch"
            ? "Cannot connect to the server."
            : err.message || "Unable to load payments.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPayments();

    return () => controller.abort();
  }, [adminToken, handleUnauthorized]);

  const filteredPayments = payments.filter((payment) => {
    const matchesStatus =
      statusFilter === "all" || payment.payment_status === statusFilter;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      [
        payment.booking_reference,
        payment.guest_name,
        payment.guest_email,
        payment.transaction_reference,
        payment.payment_method,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchText),
      );

    return matchesStatus && matchesSearch;
  });

  async function openPaymentSlip(payment) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/payments/${payment.id}/slip`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message = "Unable to open payment slip.";

        try {
          const result = await response.json();
          message = result.message || message;
        } catch {
          // The server may return a non-JSON error.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const openedWindow = window.open(fileUrl, "_blank");

      if (!openedWindow) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `payment-slip-${payment.id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to open payment slip.",
      );
    }
  }

  async function verifyPayment(payment) {
    const confirmed = window.confirm(
      `Verify the payment of ${formatMoney(
        payment.amount,
        payment.currency,
      )} for booking ${payment.booking_reference || payment.booking_id}?`,
    );

    if (!confirmed) return;

    setProcessingId(payment.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/payments/${payment.id}/verify`,
        {
          method: "PATCH",
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
        throw new Error(result.message || "Unable to verify payment.");
      }

      setNotice(
        result.message ||
          "Payment verified successfully. Review the booking separately.",
      );

      await fetchPayments();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to verify payment.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  function openRejectDialog(payment) {
    setError("");
    setNotice("");
    setRejectionReason("");
    setRejectingPayment(payment);
  }

  async function rejectPayment(event) {
    event.preventDefault();

    if (!rejectingPayment) return;

    const reason = rejectionReason.trim();

    if (reason.length < 5) {
      setError("Please provide a rejection reason of at least 5 characters.");
      return;
    }

    if (reason.length > 1000) {
      setError("The rejection reason cannot exceed 1,000 characters.");
      return;
    }

    const payment = rejectingPayment;

    setProcessingId(payment.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/payments/${payment.id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ reason }),
        },
      );

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to reject payment.");
      }

      setRejectingPayment(null);
      setRejectionReason("");

      setNotice(result.message || "Payment rejected successfully.");

      await fetchPayments();
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : err.message || "Unable to reject payment.",
      );
    } finally {
      setProcessingId(null);
    }
  }

  function logout() {
    sessionStorage.removeItem("atalayaAdminToken");
    sessionStorage.removeItem("atalayaAdmin");
    navigate("/admin/login", { replace: true });
  }

  const pendingCount = payments.filter((payment) =>
    ["pending", "under_review"].includes(payment.payment_status),
  ).length;

  const verifiedCount = payments.filter(
    (payment) => payment.payment_status === "verified",
  ).length;

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

          <Link
            to="/admin/payments"
            className="admin-nav-link admin-nav-link-active"
          >
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
            <p className="admin-eyebrow">FINANCIAL MANAGEMENT</p>
            <h1>Payments</h1>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchPayments}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        <section className="admin-payment-summary">
          <article className="admin-payment-summary-card">
            <span>Total payment records</span>
            <strong>{payments.length}</strong>
          </article>

          <article className="admin-payment-summary-card">
            <span>Awaiting review</span>
            <strong>{pendingCount}</strong>
          </article>

          <article className="admin-payment-summary-card">
            <span>Verified payments</span>
            <strong>{verifiedCount}</strong>
          </article>
        </section>

        <section className="admin-page-intro">
          <div>
            <h2>Guest Payments</h2>
            <p>
              Review submitted payments, inspect payment slips, and verify or
              reject payments.
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

        <section className="admin-booking-filters">
          <div className="admin-search-wrapper">
            <label htmlFor="payment-search">Search payments</label>

            <input
              id="payment-search"
              type="search"
              placeholder="Guest, booking reference or transaction reference"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="admin-status-filter">
            <label htmlFor="payment-status">Payment status</label>

            <select
              id="payment-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All payments</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-heading">
            <h2>Payment Records</h2>
            <p>
              {filteredPayments.length} payment
              {filteredPayments.length === 1 ? "" : "s"} displayed
            </p>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <p>Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="admin-empty-state">
              <h3>No payments found</h3>
              <p>Payments matching your search will appear here.</p>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Guest</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Transaction Reference</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => {
                    const status = payment.payment_status;
                    const isProcessing = processingId === payment.id;

                    const canVerify = status === "under_review";
                    const canReject = ["pending", "under_review"].includes(
                      status,
                    );

                    return (
                      <tr key={payment.id}>
                        <td>
                          <strong className="admin-booking-reference">
                            {payment.booking_reference ||
                              `#${payment.booking_id}`}
                          </strong>

                          <span className="admin-table-subtext">
                            {formatMoney(
                              payment.booking_total_amount,
                              payment.currency,
                            )}
                          </span>
                        </td>

                        <td>
                          <strong>{payment.guest_name || "Guest"}</strong>

                          <span className="admin-table-subtext">
                            {payment.guest_email || "No email"}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {formatMoney(payment.amount, payment.currency)}
                          </strong>
                        </td>

                        <td>
                          {formatStatus(
                            payment.method || payment.payment_method || "—",
                          )}
                        </td>

                        <td>{payment.transaction_reference || "—"}</td>

                        <td>
                          {formatDate(
                            payment.payment_date || payment.submitted_at,
                          )}
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
                            {payment.has_payment_slip !== false && (
                              <button
                                type="button"
                                className="admin-action-button admin-action-view"
                                disabled={isProcessing}
                                onClick={() => openPaymentSlip(payment)}
                              >
                                View Slip
                              </button>
                            )}

                            {canVerify && (
                              <button
                                type="button"
                                className="admin-action-button admin-action-confirm"
                                disabled={isProcessing}
                                onClick={() => verifyPayment(payment)}
                              >
                                {isProcessing ? "Processing..." : "Verify"}
                              </button>
                            )}

                            {canReject && (
                              <button
                                type="button"
                                className="admin-action-button admin-action-reject"
                                disabled={isProcessing}
                                onClick={() => openRejectDialog(payment)}
                              >
                                Reject
                              </button>
                            )}
                          </div>

                          {payment.rejection_reason && (
                            <span className="admin-table-subtext">
                              Reason: {payment.rejection_reason}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {rejectingPayment && (
          <div
            className="admin-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target === event.currentTarget &&
                processingId !== rejectingPayment.id
              ) {
                setRejectingPayment(null);
              }
            }}
          >
            <section
              className="admin-rejection-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="reject-payment-title"
            >
              <h2 id="reject-payment-title">Reject Payment</h2>

              <p>
                Provide a reason for rejecting payment for booking{" "}
                <strong>
                  {rejectingPayment.booking_reference ||
                    `#${rejectingPayment.booking_id}`}
                </strong>
                .
              </p>

              <form onSubmit={rejectPayment}>
                <label htmlFor="rejection-reason">Reason for rejection</label>

                <textarea
                  id="rejection-reason"
                  rows="5"
                  minLength="5"
                  maxLength="1000"
                  required
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain why this payment cannot be accepted..."
                />

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-modal-cancel"
                    disabled={processingId === rejectingPayment.id}
                    onClick={() => setRejectingPayment(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-modal-reject"
                    disabled={processingId === rejectingPayment.id}
                  >
                    {processingId === rejectingPayment.id
                      ? "Rejecting..."
                      : "Reject Payment"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPayments;
