import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AdminLogin from './pages/auth/login.jsx'
import DashboardLayout from './layouts/dashboardlayout.jsx'
import Dashboard from './pages/dashboard/index.jsx'

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/login" element={<AdminLogin />} />
        {/* Add more routes as needed */}

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                {/* <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="settings" element={<SettingsPage />} /> */}
              </Routes>
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
