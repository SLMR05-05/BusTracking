import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import ParentsManagement from './views/admin/Parents';
import Overview from './views/admin/Overview';
import Drivers from './views/admin/Drivers';
import Students from './views/admin/Students';
import Buses from './views/admin/Buses';
import RoutesManagement from './views/admin/Routes';
import Tracking from './views/admin/Tracking';
import Stations from './views/admin/Stations';
import DriverDashboard from './views/driver/DriverDashboard';
import DriverTracking from './views/driver/DriverTracking';
import ParentDashboard from './views/parent/ParentDashboard';
import ParentHistory from './views/parent/ParentHistory';
import ParentTracking from './views/parent/ParentTracking';
import Schedule from './views/admin/Schedule';
import PrivateRoute from './components/PrivateRoute';
import TheoDoiXe from './views/DriverTracking';
import DriverTable from './views/DriverSchedule';
import DriverTracking from './views/DriverTracking';
import DriverSchedule from './views/DriverTracking';
import ParentTracking from './views/ParentTracking';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Overview />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Students />
                </PrivateRoute>
              }
            />
            <Route
              path="/buses"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Buses />
                </PrivateRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Drivers />
                </PrivateRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <RoutesManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Tracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/stations"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Stations />
                </PrivateRoute>
              }
            />
            <Route
              path="/parents"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <ParentsManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Schedule />
                </PrivateRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver-dashboard"
              element={
                <PrivateRoute allowedRoles={['driver']}>
                  <DriverDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/driver-tracking"
              element={
                <PrivateRoute allowedRoles={['driver']}>
                  <DriverTracking />
                </PrivateRoute>
              }
            />

            {/* Parent Routes */}
            <Route
              path="/parent-dashboard"
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <ParentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent-tracking"
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <ParentTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent-history"
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <ParentHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent"
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <ParentTracking />
                </PrivateRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;