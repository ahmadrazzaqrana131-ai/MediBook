export default function Appointments({ user, appointments, onCancel }) {
 return <main className="content-section doctors-section"><span className="eyebrow">YOUR HEALTH JOURNEY</span><h1>My appointments</h1><p>Hi {user.name}, manage your appointment requests here.</p>
  {appointments.length?<div className="appointment-list">{appointments.map(a=><article className="appointment-card" key={a.id}><div><h3>{a.doctorName}</h3><p>{a.specialty}</p><p>Date: {a.date} · Time: {a.time}</p><p>Consultation fee: Rs. {a.fee}</p></div><div className="appointment-actions"><span className="status-pill">{a.status}</span><button className="cancel-btn" onClick={()=>onCancel(a.id)}>Cancel</button></div></article>)}</div>:<div className="empty-state"><h2>No appointments yet</h2><p>Your booked appointments will appear here.</p><a href="/doctors" className="primary-btn">Find a doctor</a></div>}
 </main>;
}
