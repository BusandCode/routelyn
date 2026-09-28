import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { TrackPage } from './pages/TrackPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { CreateShipmentPage } from './pages/CreateShipmentPage';
import { DriverPage } from './pages/DriverPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:trackingNumber" element={<TrackPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute roles={['ADMIN', 'STAFF']}><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/shipments"
              element={<ProtectedRoute roles={['ADMIN', 'STAFF']}><ShipmentsPage /></ProtectedRoute>}
            />
            <Route
              path="/shipments/new"
              element={<ProtectedRoute roles={['ADMIN', 'STAFF']}><CreateShipmentPage /></ProtectedRoute>}
            />
            <Route
              path="/driver"
              element={<ProtectedRoute roles={['DRIVER']}><DriverPage /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
