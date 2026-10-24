import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";

// Main website
import Home from "./pages/Home";
import VillasPage from "./pages/VillasPage";
import AboutPage from "./pages/AboutPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import OurStoryPage from "./pages/OurStoryPage";
import ContactPage from "./pages/ContactPage";

// Booking website
import BookingPage from "./pages/BookingPage";
import BookingContactPage from "./pages/BookingContactPage";
import BookingPoliciesPage from "./pages/BookingPoliciesPage";

// Dining pages
import DiningPage from "./pages/DiningPage";
import MenuPage from "./pages/MenuPage";
import JournalPage from "./pages/JournalPage";
import JournalArticle from "./pages/JournalArticle";
import ReservationsPage from "./pages/ReservationsPage";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AccommodationInventory from "./admin/AccommodationInventory";
import AdminBookings from "./admin/AdminBookings";
import AdminPayments from "./admin/AdminPayments";
import AdminSettings from "./admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Main website */}
        <Route path="/" element={<Home />} />
        <Route path="/villas" element={<VillasPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Booking website */}
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/booking/about" element={<AboutPage />} />
        <Route path="/booking/contact" element={<BookingContactPage />} />
        <Route path="/booking/policies" element={<BookingPoliciesPage />} />

        {/* Dining */}
        <Route path="/dining" element={<DiningPage />} />
        <Route path="/dining/menu" element={<MenuPage />} />
        <Route path="/dining/journal" element={<JournalPage />} />

        <Route
          path="/dining/journal/eco-food-project"
          element={<JournalArticle />}
        />

        <Route path="/dining/reservations" element={<ReservationsPage />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route
          path="/admin/accommodations"
          element={<AccommodationInventory />}
        />

        <Route path="/admin/bookings" element={<AdminBookings />} />

        <Route path="/admin/payments" element={<AdminPayments />} />

        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
