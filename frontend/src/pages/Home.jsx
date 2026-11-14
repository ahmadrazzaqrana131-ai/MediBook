
import { Link } from "react-router-dom";
import { doctors } from "../data/doctors.js";

export default function Home() {
  const stats = [
    { number: "500+", label: "Expert Doctors", icon: "✚" },
    { number: "10K+", label: "Happy Patients", icon: "♡" },
    { number: "50+", label: "Specializations", icon: "⚕" },
    { number: "24/7", label: "Online Support", icon: "◷" }
  ];

  const steps = [
    {
      number: "01",
      icon: "⌕",
      title: "Find your specialist",
      description:
        "Explore verified doctors by specialty, experience and patient ratings.",
      tag: "DISCOVER"
    },
    {
      number: "02",
      icon: "▣",
      title: "Book with confidence",
      description:
        "Choose your preferred doctor and schedule a time that works for you.",
      tag: "SCHEDULE"
    },
    {
      number: "03",
      icon: "♡",
      title: "Focus on your health",
      description:
        "Get the care and guidance you need from healthcare professionals.",
      tag: "GET BETTER"
    }
  ];

  const featuredDoctors = doctors.slice(0, 3);

  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-background-shape"></div>

        <div className="home-hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              YOUR HEALTH, OUR PRIORITY
            </div>

            <h1>
              Healthcare that
              <br />
              puts <span>you first.</span>
            </h1>

            <p className="hero-description">
              Your health deserves attention, care and the right
              specialist. Discover trusted doctors and book
              appointments without the hassle.
            </p>

            <div className="hero-buttons">
              <Link to="/doctors" className="hero-primary-btn">
                Find a doctor <span>→</span>
              </Link>

              <Link to="/signup" className="hero-secondary-btn">
                Create free account
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>SA</span>
                <span>JW</span>
                <span>EC</span>
                <span>+</span>
              </div>

              <div>
                <strong>Care you can count on</strong>
                <p>Making healthcare more accessible</p>
              </div>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="hero-main-image">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000"
                alt="Professional healthcare doctor"
              />

              <div className="hero-image-label">
                <span className="image-label-icon">✚</span>
                <div>
                  <strong>Professional care</strong>
                  <small>For every stage of life</small>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon">✓</span>
              <div>
                <strong>Trusted specialists</strong>
                <small>Find the right care</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <div className="floating-calendar">▣</div>
              <div>
                <strong>Easy appointments</strong>
                <small>Book in a few clicks</small>
              </div>
            </div>

            <div className="hero-circle"></div>
          </div>
        </div>

        <div className="hero-bottom-line">
          <span>BETTER ACCESS</span>
          <span className="hero-line"></span>
          <span>BETTER CARE</span>
          <span className="hero-line"></span>
          <span>BETTER YOU</span>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section">
        <div className="stats-heading">
          <span className="eyebrow">MEDIBOOK AT A GLANCE</span>
          <h2>Care that makes a difference.</h2>
        </div>

        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">{item.icon}</div>
              <div>
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="stats-note">
          <span>*</span> Illustrative project statistics for this demo.
        </p>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="featured-section">
        <div className="featured-heading">
          <div>
            <span className="eyebrow">MEET OUR SPECIALISTS</span>
            <h2>Care from the right people.</h2>
            <p>
              Explore our featured healthcare professionals
              and find a specialist for your needs.
            </p>
          </div>

          <Link to="/doctors" className="text-link">
            Explore all doctors <span>→</span>
          </Link>
        </div>

        <div className="featured-doctor-grid">
          {featuredDoctors.map(doctor => (
            <article className="featured-doctor-card" key={doctor.id}>
              <div className="featured-doctor-image">
                <img src={doctor.image} alt={doctor.name} />
                <span className="featured-rating">
                  ★ {doctor.rating}
                </span>
              </div>

              <div className="featured-doctor-info">
                <span className="featured-specialty">
                  {doctor.specialty}
                </span>

                <h3>{doctor.name}</h3>
                <p>{doctor.about}</p>

                <div className="featured-doctor-bottom">
                  <strong>
                    Rs. {Number(doctor.fee).toLocaleString("en-PK")}
                  </strong>

                  <Link to="/doctors" aria-label={`View ${doctor.name}`}>
                    View profile →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section">
        <div className="process-heading">
          <span className="eyebrow">A SIMPLER WAY TO GET CARE</span>
          <h2>
            Your health journey,
            <br />
            <span>made effortless.</span>
          </h2>
          <p>
            From discovering a specialist to getting the care
            you need, MediBook makes every step easier.
          </p>
        </div>

        <div className="process-grid">
          {steps.map((step, index) => (
            <article className="process-card" key={step.number}>
              <div className="process-card-top">
                <span className="process-number">{step.number}</span>
                <span className="process-icon">{step.icon}</span>
              </div>

              <span className="process-tag">{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>

              {index !== 2 && (
                <span className="process-arrow">↗</span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="home-cta-section">
        <div className="home-cta-content">
          <span className="cta-label">TAKE THE FIRST STEP</span>

          <h2>
            Your wellbeing
            <br />
            <span>starts here.</span>
          </h2>

          <p>
            Don't put your health on hold. Find a specialist
            and take the next step towards better care.
          </p>

          <Link to="/doctors" className="cta-white-btn">
            Explore doctors <span>→</span>
          </Link>
        </div>

        <div className="cta-decoration cta-decoration-one"></div>
        <div className="cta-decoration cta-decoration-two"></div>
        <div className="cta-plus">✚</div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              MediBook<span>.</span>
            </Link>

            <p>
              Making quality healthcare easier to access.
              Connecting people with the care they deserve.
            </p>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <Link to="/">Home</Link>
            <Link to="/doctors">Find doctors</Link>
            <Link to="/signup">Create account</Link>
          </div>

          <div className="footer-column">
            <h4>Account</h4>
            <Link to="/login">Patient login</Link>
            <Link to="/login">Doctor login</Link>
            <Link to="/signup">Join MediBook</Link>
          </div>

          <div className="footer-column">
            <h4>Get started</h4>
            <p>Take control of your healthcare journey.</p>
            <Link to="/doctors" className="footer-action">
              Book an appointment →
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 MediBook. Demo project.</span>
          <span>Designed for better healthcare access.</span>
        </div>
      </footer>

    </main>
  );
}
