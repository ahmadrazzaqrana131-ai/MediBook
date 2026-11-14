
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Doctors from "./pages/Doctors.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import AIAssistant from "./components/AIAssistant.jsx";

import "./App.css";
import "./components/AIAssistant.css";

const readStorage = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function AppContent() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    readStorage("medibook_user", null)
  );

  const [appointments, setAppointments] = useState(() =>
    readStorage("medibook_appointments", [])
  );

  useEffect(() => {
    localStorage.setItem(
      "medibook_appointments",
      JSON.stringify(appointments)
    );
  }, [appointments]);

  function signup(data) {
    const users = readStorage("medibook_users", []);
    const email = data.email.trim().toLowerCase();

    const alreadyExists = users.some(
      account => account.email.toLowerCase() === email
    );

    if (alreadyExists) {
      return {
        ok: false,
        message: "This email is already registered. Please login."
      };
    }

    const newAccount = { ...data, email };

    localStorage.setItem(
      "medibook_users",
      JSON.stringify([...users, newAccount])
    );

    const activeUser = {
      name: newAccount.name,
      email: newAccount.email,
      role: newAccount.role,
      specialty: newAccount.specialty || ""
    };

    localStorage.setItem(
      "medibook_user",
      JSON.stringify(activeUser)
    );

    setUser(activeUser);

    return { ok: true };
  }

  function login(data) {
    const users = readStorage("medibook_users", []);

    const email = data.email.trim().toLowerCase();

    const account = users.find(
      item =>
        item.email.toLowerCase() === email &&
        item.password === data.password &&
        item.role === data.role
    );

    if (!account) {
      return {
        ok: false,
        message: "Incorrect email, password or account type."
      };
    }

    const activeUser = {
      name: account.name,
      email: account.email,
      role: account.role,
      specialty: account.specialty || ""
    };

    localStorage.setItem(
      "medibook_user",
      JSON.stringify(activeUser)
    );

    setUser(activeUser);

    return { ok: true };
  }

  function logout() {
    localStorage.removeItem("medibook_user");
    setUser(null);
    navigate("/", { replace: true });
  }

  function book(data) {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "patient") {
      alert("Only patients can book appointments.");
      return;
    }

    const users = readStorage("medibook_users", []);

    const doctor = users.find(
      account =>
        account.role === "doctor" &&
        account.name.trim().toLowerCase() ===
          String(data.doctorName).trim().toLowerCase()
    );

    const newAppointment = {
      id: Date.now(),
      patientEmail: user.email,
      patientName: user.name,
      doctorEmail: doctor?.email || "",
      status: "Pending",
      ...data
    };

    setAppointments(current => [
      ...current,
      newAppointment
    ]);

    navigate("/appointments");
  }

  function cancelAppointment(id) {
    setAppointments(current =>
      current.filter(item => item.id !== id)
    );
  }

  const patientAppointments = appointments.filter(
    item => item.patientEmail === user?.email
  );

  const doctorAppointments = appointments.filter(
    item => item.doctorEmail === user?.email
  );

  const dashboardPath =
    user?.role === "doctor"
      ? "/doctor-dashboard"
      : "/dashboard";

  return (
    <>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route
          path="/"
          element={<Home onBook={book} />}
        />

        <Route
          path="/doctors"
          element={<Doctors onBook={book} />}
        />

        <Route
          path="/signup"
          element={
            user
              ? <Navigate to={dashboardPath} replace />
              : <Signup onSignup={signup} />
          }
        />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to={dashboardPath} replace />
              : <Login onLogin={login} />
          }
        />

        <Route
          path="/dashboard"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.role === "patient"
                ? <PatientDashboard
                    user={user}
                    appointments={patientAppointments}
                  />
                : <Navigate to="/doctor-dashboard" replace />
          }
        />

        <Route
          path="/doctor-dashboard"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.role === "doctor"
                ? <DoctorDashboard
                    user={user}
                    appointments={doctorAppointments}
                  />
                : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/appointments"
          element={
            !user
              ? <Navigate to="/login" replace />
              : user.role === "patient"
                ? <Appointments
                    user={user}
                    appointments={patientAppointments}
                    onCancel={cancelAppointment}
                  />
                : <Navigate to="/doctor-dashboard" replace />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
      <AIAssistant />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
