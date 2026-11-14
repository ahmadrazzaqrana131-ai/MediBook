
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ onSignup }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [specialty, setSpecialty] = useState("General Physician");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const result = onSignup({
      role,
      name: name.trim(),
      email: email.trim(),
      password,
      specialty: role === "doctor" ? specialty : ""
    });

    if (!result?.ok) {
      setError(result?.message || "Signup failed.");
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

          <span className="eyebrow">YOUR CARE STARTS HERE</span>

          <h2>
            Better care begins with
            <em> a connection.</em>
          </h2>

          <p>
            Discover trusted doctors and manage your
            appointments with MediBook.
          </p>

          <div className="auth-benefits">
            <span>✓ Easy appointment booking</span>
            <span>✓ Dedicated patient and doctor portals</span>
            <span>✓ Manage appointments easily</span>
          </div>
        </div>
      </section>

      <section className="auth-main">
        <form className="auth-card signup-card" onSubmit={submit}>
          <span className="eyebrow">JOIN MEDIBOOK</span>

          <h1>Create your account</h1>

          <p className="auth-intro">
            Enter your details to get started.
          </p>

          <label>
            Account type
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

          {role === "doctor" && (
            <label>
              Medical specialty
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
              >
                <option>General Physician</option>
                <option>Cardiologist</option>
                <option>Neurologist</option>
                <option>Dentist</option>
                <option>Dermatologist</option>
                <option>Pediatrician</option>
              </select>
            </label>
          )}

          <label>
            Full name
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
            />
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

          <div className="auth-two-col">
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </label>

            <label>
              Confirm password
              <input
                required
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
              />
            </label>
          </div>

          {error && (
            <p className="error-text">{error}</p>
          )}

          <button
            className="primary-btn full-btn auth-submit"
            type="submit"
          >
            Create {role} account <span>→</span>
          </button>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login"> Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
