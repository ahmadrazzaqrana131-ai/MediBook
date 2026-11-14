import { useEffect, useState } from "react";

const appointmentTimes = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

function getLocalDate() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function BookingModal({ doctor, onClose, onConfirm }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  useEffect(() => {
    if (!doctor) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [doctor, onClose]);

  if (!doctor) return null;

  function submit(event) {
    event.preventDefault();
    onConfirm({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      fee: doctor.fee,
      date,
      time
    });
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onSubmit={submit}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close booking dialog"
          onClick={onClose}
        >
          &times;
        </button>
        <span className="eyebrow">BOOK A VISIT</span>
        <h2 id="booking-title">Appointment with {doctor.name}</h2>
        <p>{doctor.specialty} · Consultation fee Rs. {doctor.fee}</p>
        <label>
          Choose date
          <input
            type="date"
            required
            min={getLocalDate()}
            value={date}
            onChange={event => setDate(event.target.value)}
          />
        </label>
        <label>
          Choose time
          <select value={time} onChange={event => setTime(event.target.value)}>
            {appointmentTimes.map(appointmentTime => (
              <option key={appointmentTime} value={appointmentTime}>
                {appointmentTime}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-btn full-btn" type="submit">
          Confirm appointment
        </button>
      </form>
    </div>
  );
}
