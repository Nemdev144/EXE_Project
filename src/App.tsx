import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import StaffLayout from "./components/staff/StaffLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import ContentManagementPage from "./pages/admin/ContentManagement";
import TourManagementPage from "./pages/admin/TourManagement";
import BookingManagementPage from "./pages/admin/BookingManagement";
import ArtisanManagementPage from "./pages/admin/ArtisanManagement";
import UserManagementPage from "./pages/admin/UserManagement";
import EmailTemplatesPage from "./pages/admin/EmailTemplates";

// Staff Pages
import StaffDashboardPage from "./pages/staff/StaffDashboard";
import StaffBookingManagementPage from "./pages/staff/BookingManagement";
import TourCoordinationPage from "./pages/staff/TourCoordination";
import StaffArtisanManagementPage from "./pages/staff/ArtisanManagement";
import StaffContentManagementPage from "./pages/staff/ContentManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/*"
          element={
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/content" element={<ContentManagementPage />} />
                <Route path="/tours" element={<TourManagementPage />} />
                <Route path="/bookings" element={<BookingManagementPage />} />
                <Route path="/artisans" element={<ArtisanManagementPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/emails" element={<EmailTemplatesPage />} />
              </Routes>
            </AdminLayout>
          }
        />

        {/* Staff Routes */}
        <Route
          path="/staff/*"
          element={
            <StaffLayout>
              <Routes>
                <Route path="/" element={<StaffDashboardPage />} />
                <Route path="/bookings" element={<StaffBookingManagementPage />} />
                <Route path="/tours" element={<TourCoordinationPage />} />
                <Route path="/artisans" element={<StaffArtisanManagementPage />} />
                <Route path="/content" element={<StaffContentManagementPage />} />
              </Routes>
            </StaffLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
