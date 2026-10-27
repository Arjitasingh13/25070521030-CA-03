import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout.jsx';
import { AuthProvider } from './auth.jsx';
import { useAuth } from './auth-context.js';
import WelcomePage from './pages/WelcomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import DeveloperPage from './pages/DeveloperPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import AddEventPage from './pages/AddEventPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ManageEventsPage from './pages/ManageEventsPage.jsx';
import RegisterEventPage from './pages/RegisterEventPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import SpeakersPage from './pages/SpeakersPage.jsx';
import SponsorsPage from './pages/SponsorsPage.jsx';

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/signin" replace state={{ from: location }} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/speakers" element={<SpeakersPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/register-event" element={<RegisterEventPage />} />
              <Route path="/add-event" element={<AddEventPage />} />
              <Route path="/manage" element={<ManageEventsPage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/developer" element={<DeveloperPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SiteLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
