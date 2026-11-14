
export default function DoctorCard({ doctor, onBook }) {
  return (
    <article className="doctor-card">

      <img
        className="doctor-photo"
        src={doctor.image}
        alt={doctor.name}
        loading="lazy"
      />

      <div className="doctor-card-body">

        <div className="doctor-rating">
          ★ {doctor.rating}
        </div>

        <h3>{doctor.name}</h3>

        <p className="doctor-specialty">
          {doctor.specialty}
        </p>

        <p className="doctor-about">
          {doctor.about}
        </p>

        <div className="doctor-meta">
          <span>{doctor.experience} experience</span>

          <strong>
            Rs. {Number(doctor.fee).toLocaleString("en-PK")}
          </strong>
        </div>

        <button
          type="button"
          className="primary-btn full-btn"
          onClick={() => onBook(doctor)}
        >
          Book appointment →
        </button>

      </div>
    </article>
  );
}
