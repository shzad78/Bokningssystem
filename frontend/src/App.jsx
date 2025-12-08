import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookingForm from './pages/BookingForm';
import BookingList from './pages/BookingList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/bookings" element={<BookingList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
