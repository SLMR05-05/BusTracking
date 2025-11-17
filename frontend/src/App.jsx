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
// import DriverTracking from './views/DriverTracking';
import DriverSchedule from './views/DriverSchedule';

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
                <PrivateRoute allowedRoles={['AD']}>
                  <Overview />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Students />
                </PrivateRoute>
              }
            />
            <Route
              path="/buses"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Buses />
                </PrivateRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Drivers />
                </PrivateRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <RoutesManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Tracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/stations"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Stations />
                </PrivateRoute>
              }
            />
            <Route
              path="/parents"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <ParentsManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute allowedRoles={['AD']}>
                  <Schedule />
                </PrivateRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver-dashboard"
              element={
                <PrivateRoute allowedRoles={['TX']}>
                  <DriverDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/driver-tracking"
              element={
                <PrivateRoute allowedRoles={['TX']}>
                  <DriverTracking />
                </PrivateRoute>
              }
            />
             <Route
              path="/driver-schedule"
              element={
                <PrivateRoute allowedRoles={['TX']}>
                  <DriverSchedule />
                </PrivateRoute>
              }
            />

            {/* Parent Routes */}
            <Route
              path="/parent-dashboard"
              element={
                <PrivateRoute allowedRoles={['PH']}>
                  <ParentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent-tracking"
              element={
                <PrivateRoute allowedRoles={['PH']}>
                  <ParentTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent-history"
              element={
                <PrivateRoute allowedRoles={['PH']}>
                  <ParentHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/parent"
              element={
                <PrivateRoute allowedRoles={['PH']}>
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