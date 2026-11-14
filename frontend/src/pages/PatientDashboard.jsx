import { Link } from "react-router-dom";
export default function PatientDashboard({ user, appointments }) {
 const upcoming=appointments.filter(a=>a.date>=new Date().toISOString().slice(0,10));
 return <main className="content-section dashboard-section"><span className="eyebrow">PATIENT DASHBOARD</span><h1>Welcome, {user.name}!</h1><p>Here is a quick overview of your MediBook account.</p>
  <div className="dashboard-stats"><article><span>Total appointments</span><strong>{appointments.length}</strong></article><article><span>Upcoming appointments</span><strong>{upcoming.length}</strong></article><article><span>Account type</span><strong>Patient</strong></article></div>
  <div className="dashboard-panel"><div><h2>Your profile</h2><p><b>Name:</b> {user.name}</p><p><b>Email:</b> {user.email}</p><p><b>Role:</b> Patient</p></div><Link className="primary-btn" to="/doctors">Find a doctor</Link></div>
  <div className="section-top dashboard-appointments-head"><div><h2>Recent appointments</h2><p>Your latest booking requests.</p></div><Link className="text-btn" to="/appointments">View all →</Link></div>
  {appointments.length?<div className="appointment-list">{appointments.slice(0,3).map(a=><article className="appointment-card" key={a.id}><div><h3>{a.doctorName}</h3><p>{a.specialty} · {a.date} at {a.time}</p></div><span className="status-pill">{a.status}</span></article>)}</div>:<div className="empty-state"><p>You have not booked any appointments yet.</p><Link to="/doctors" className="primary-btn">Book your first appointment</Link></div>}
 </main>;
}
