import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function BookingForm() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
    status: 'confirmed'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, timeSlotsData] = await Promise.all([
          api.getServices(),
          api.getTimeSlots()
        ]);
        setServices(servicesData);
        setTimeSlots(timeSlotsData);
      } catch {
        setError('Failed to load form data. Please make sure the backend is running.');
      }
    };
    fetchData();
  }, []);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'customerName':
        if (!value.trim()) {
          return 'Name cannot be empty';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Name must not exceed 100 characters';
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return 'Name can only contain letters, spaces, hyphens and apostrophes';
        }
        return '';

      case 'email':
        if (!value.trim()) {
          return 'Email cannot be empty';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address (e.g., name@example.com)';
        }
        if (value.length > 254) {
          return 'Email is too long';
        }
        return '';

      case 'phone':
        if (!value.trim()) {
          return 'Phone number cannot be empty';
        }
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          return 'Phone number must have at least 10 digits';
        }
        if (phoneDigits.length > 15) {
          return 'Phone number is too long';
        }
        if (!/^[\d\s\-+()]+$/.test(value)) {
          return 'Phone number can only contain numbers, spaces, hyphens, plus sign and parentheses';
        }
        return '';

      case 'service':
        if (!value) {
          return 'Please select a service';
        }
        return '';

      case 'date':
        if (!value) {
          return 'Please select a date';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return 'Date cannot be in the past';
        }
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 6);
        if (selectedDate > maxDate) {
          return 'Date cannot be more than 6 months in the future';
        }
        return '';

      case 'time':
        if (!value) {
          return 'Please select a time slot';
        }
        return '';

      case 'notes':
        if (value.length > 500) {
          return 'Notes must not exceed 500 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setValidationErrors({
        ...validationErrors,
        [name]: error
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched({
      ...touched,
      [name]: true
    });

    // Validate on blur
    const error = validateField(name, value);
    setValidationErrors({
      ...validationErrors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'notes' && key !== 'status') { // notes and status are optional
        const error = validateField(key, formData[key]);
        if (error) {
          errors[key] = error;
        }
      }
    });

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the errors below before submitting');
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setLoading(true);

    try {
      await api.createBooking(formData);
      navigate('/bookings');
    } catch (err) {
      setError('Failed to create booking. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form-page">
      <h1>Book an Appointment</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="booking-form" noValidate>
        <div className={`form-group ${validationErrors.customerName && touched.customerName ? 'error' : ''}`}>
          <label htmlFor="customerName">Name *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={validationErrors.customerName && touched.customerName ? 'true' : 'false'}
            aria-describedby={validationErrors.customerName && touched.customerName ? 'customerName-error' : undefined}
            placeholder="Enter your full name"
          />
          {validationErrors.customerName && touched.customerName && (
            <span className="field-error" id="customerName-error" role="alert">
              {validationErrors.customerName}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.email && touched.email ? 'error' : ''}`}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={validationErrors.email && touched.email ? 'true' : 'false'}
            aria-describedby={validationErrors.email && touched.email ? 'email-error' : undefined}
            placeholder="name@example.com"
          />
          {validationErrors.email && touched.email && (
            <span className="field-error" id="email-error" role="alert">
              {validationErrors.email}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.phone && touched.phone ? 'error' : ''}`}>
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={validationErrors.phone && touched.phone ? 'true' : 'false'}
            aria-describedby={validationErrors.phone && touched.phone ? 'phone-error' : undefined}
            placeholder="+1 (555) 123-4567"
          />
          {validationErrors.phone && touched.phone && (
            <span className="field-error" id="phone-error" role="alert">
              {validationErrors.phone}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.service && touched.service ? 'error' : ''}`}>
          <label htmlFor="service">Service *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={validationErrors.service && touched.service ? 'true' : 'false'}
            aria-describedby={validationErrors.service && touched.service ? 'service-error' : undefined}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name} - ${service.price} ({service.duration} mins)
              </option>
            ))}
          </select>
          {validationErrors.service && touched.service && (
            <span className="field-error" id="service-error" role="alert">
              {validationErrors.service}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.date && touched.date ? 'error' : ''}`}>
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            min={minDate}
            required
            aria-invalid={validationErrors.date && touched.date ? 'true' : 'false'}
            aria-describedby={validationErrors.date && touched.date ? 'date-error' : undefined}
          />
          {validationErrors.date && touched.date && (
            <span className="field-error" id="date-error" role="alert">
              {validationErrors.date}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.time && touched.time ? 'error' : ''}`}>
          <label htmlFor="time">Time *</label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            aria-invalid={validationErrors.time && touched.time ? 'true' : 'false'}
            aria-describedby={validationErrors.time && touched.time ? 'time-error' : undefined}
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {validationErrors.time && touched.time && (
            <span className="field-error" id="time-error" role="alert">
              {validationErrors.time}
            </span>
          )}
        </div>

        <div className={`form-group ${validationErrors.notes && touched.notes ? 'error' : ''}`}>
          <label htmlFor="notes">
            Additional Notes
            {formData.notes && (
              <span className="character-count">
                {formData.notes.length}/500
              </span>
            )}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            maxLength="500"
            aria-invalid={validationErrors.notes && touched.notes ? 'true' : 'false'}
            aria-describedby={validationErrors.notes && touched.notes ? 'notes-error' : undefined}
            placeholder="Any special requests or preferences?"
          />
          {validationErrors.notes && touched.notes && (
            <span className="field-error" id="notes-error" role="alert">
              {validationErrors.notes}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
