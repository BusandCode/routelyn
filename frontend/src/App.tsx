import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/track/:trackingNumber" element={<TrackPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments"
              element={
                <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                  <ShipmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shipments/new"
              element={
                <ProtectedRoute roles={['ADMIN', 'STAFF']}>
                  <CreateShipmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute roles={['DRIVER']}>
                  <DriverPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
