import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
      setError('');
    } catch {
      setError('Failed to load bookings. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await api.deleteBooking(id);
      setBookings(bookings.filter(booking => booking.id !== id));
    } catch {
      setError('Failed to delete booking. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="booking-list-page">
      <div className="page-header">
        <h1>All Bookings</h1>
        <Link to="/book" className="btn btn-primary">New Booking</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found.</p>
          <Link to="/book" className="btn btn-primary">Create your first booking</Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.customerName}</h3>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Service:</strong> {booking.service}</p>
                <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                {booking.notes && (
                  <p><strong>Notes:</strong> {booking.notes}</p>
                )}
              </div>
              <div className="booking-actions">
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
