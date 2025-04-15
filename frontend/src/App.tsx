import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResourceRequest from './pages/teacher/ResourceRequest';
import LabBooking from './pages/teacher/LabBooking';
import LabManagement from './pages/labtech/LabManagement';
import StoreManagement from './pages/storekeeper/StoreManagement';
import LibraryManagement from './pages/librarian/LibraryManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import Reports from './pages/admin/Reports';
import StockControl from './pages/admin/StockControl';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          
          {/* Teacher Routes */}
          <Route path="/resource-request" element={<ResourceRequest />} />
          <Route path="/lab-booking" element={<LabBooking />} />
          
          {/* Lab Technician Routes */}
          <Route path="/lab-management" element={<LabManagement />} />
          
          {/* Storekeeper Routes */}
          <Route path="/store-management" element={<StoreManagement />} />
          
          {/* Librarian Routes */}
          <Route path="/library-management" element={<LibraryManagement />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/stock-control" element={<StockControl />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;