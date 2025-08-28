import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Exhibitors from './pages/Exhibitors';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="exhibitors" element={<Exhibitors />} />
              <Route path="schedule" element={<div className="p-6">Schedule Management - Coming Soon</div>} />
              <Route path="attendees" element={<div className="p-6">Attendee Management - Coming Soon</div>} />
              <Route path="analytics" element={<div className="p-6">Analytics - Coming Soon</div>} />
              <Route path="settings" element={<div className="p-6">Settings - Coming Soon</div>} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;