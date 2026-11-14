
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    const result = onLogin({
      role,
      email: email.trim(),
      password
    });

    if (!result?.ok) {
      setError(result?.message || "Login failed.");
      return;
    }

    navigate(
      role === "doctor"
        ? "/doctor-dashboard"
        : "/dashboard",
      { replace: true }
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-aside">
        <div className="auth-aside-content">
          <span className="auth-brand-mark">M</span>

          <span className="eyebrow">CARE THAT CONNECTS</span>

          <h2>
            Your health journey,
            <em> made simpler.</em>
          </h2>

          <p>
            Book trusted doctors and keep your appointments
            organized in one place.
          </p>

          <div className="auth-benefits">
            <span>✓ Easy appointment booking</span>
            <span>✓ Personal dashboard</span>
            <span>✓ Dedicated doctor portal</span>
          </div>
        </div>
      </section>

      <section className="auth-main">
        <form className="auth-card" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>

          <h1>Sign in to MediBook</h1>

          <p className="auth-intro">
            Enter your details to access your account.
          </p>

          <label>
            Login as
            <select
              value={role}
              onChange={e => {
                setRole(e.target.value);
                setError("");
              }}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </label>

          <label>
            Email address
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          {error && (
            <p className="error-text">{error}</p>
          )}

          <button
            className="primary-btn full-btn auth-submit"
            type="submit"
          >
            Sign in to {role === "doctor" ? "Doctor Portal" : "Patient Portal"}
            <span>→</span>
          </button>

          <p className="auth-switch">
            New to MediBook?
            <Link to="/signup"> Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
