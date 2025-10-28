import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Parents from './views/Parents';
import ParentsManagement from './views/ParentsManagement';
import Overview from './views/Overview';
import Drivers from './views/driver/Drivers';
import Students from './views/Students';
import Buses from './views/Buses';
import RoutesManagement from './views/Routes';
import Tracking from './views/Tracking';
import Settings from './views/Settings';
import PrivateRoute from './components/PrivateRoute';

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
              path="/settings"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <Settings />
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

            {/* Driver Routes */}
            <Route
              path="/driver-dashboard"
              element={
                <PrivateRoute allowedRoles={['driver']}>
                  <Drivers />
                </PrivateRoute>
              }
            />

            {/* Parent Routes */}
            <Route
              path="/parent-dashboard"
              element={
                <PrivateRoute allowedRoles={['parent']}>
                  <Parents />
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