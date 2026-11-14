
import { useState } from "react";
import BookingModal from "../components/BookingModal.jsx";
import DoctorCard from "../components/DoctorCard.jsx";
import { doctors } from "../data/doctors.js";

export default function Doctors({ onBook }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <>
      <main className="content-section doctors-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">OUR SPECIALISTS</span>
            <h1>Find the right doctor</h1>
            <p>
              Connect with experienced healthcare professionals
              and book your appointment.
            </p>
          </div>
        </div>

        <div className="doctor-grid">
          {doctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => setSelectedDoctor(doctor)}
            />
          ))}
        </div>
      </main>
      <BookingModal
        key={selectedDoctor?.id ?? "closed"}
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onConfirm={onBook}
      />
    </>
  );
}
