import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Our Booking System</h1>
        <p>Book your appointments easily and manage your reservations</p>
        <div className="cta-buttons">
          <Link to="/book" className="btn btn-primary">Book Now</Link>
          <Link to="/bookings" className="btn btn-secondary">View Bookings</Link>
        </div>
      </div>

      <div className="features">
        <h2>Our Services</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Haircut</h3>
            <p>Professional haircut and styling</p>
            <p className="price">$50 - 30 mins</p>
          </div>
          <div className="feature-card">
            <h3>Massage</h3>
            <p>Relaxing full body massage</p>
            <p className="price">$80 - 60 mins</p>
          </div>
          <div className="feature-card">
            <h3>Facial</h3>
            <p>Deep cleansing facial treatment</p>
            <p className="price">$70 - 45 mins</p>
          </div>
          <div className="feature-card">
            <h3>Manicure</h3>
            <p>Hand care and nail polish</p>
            <p className="price">$40 - 30 mins</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
