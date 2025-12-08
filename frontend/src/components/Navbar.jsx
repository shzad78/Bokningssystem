import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Booking System
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/book" className="nav-link">Book</Link>
          </li>
          <li className="nav-item">
            <Link to="/bookings" className="nav-link">Bookings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
