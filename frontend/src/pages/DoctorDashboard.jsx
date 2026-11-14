export default function DoctorDashboard({user,appointments}){
 return <main className="content-section dashboard-section"><span className="eyebrow">DOCTOR PORTAL</span><h1>Welcome, {user.name}!</h1><p>Manage your profile and view patient appointment requests.</p>
 <div className="dashboard-stats"><article><span>Appointment requests</span><strong>{appointments.length}</strong></article><article><span>Specialty</span><strong className="specialty-stat">{user.specialty||"Doctor"}</strong></article><article><span>Account type</span><strong>Doctor</strong></article></div>
 <div className="dashboard-panel"><div><h2>Doctor profile</h2><p><b>Name:</b> {user.name}</p><p><b>Email:</b> {user.email}</p><p><b>Specialty:</b> {user.specialty||"Not specified"}</p></div></div>
 <h2 className="doctor-requests-title">Patient appointment requests</h2>{appointments.length?<div className="appointment-list">{appointments.map(a=><article className="appointment-card" key={a.id}><div><h3>{a.patientName}</h3><p>{a.patientEmail}</p><p>{a.date} at {a.time}</p></div><span className="status-pill">{a.status}</span></article>)}</div>:<div className="empty-state"><h3>No appointment requests yet</h3><p>Requests assigned to your account will appear here.</p></div>}
 </main>;
}
