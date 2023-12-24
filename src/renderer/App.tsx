import { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Login,
  Main,
  Registration,
  Settings,
  Downloading,
  Menu,
  ForgotPassword,
  Mods,
  GlobalLoader,
} from './components';
import { Notifications, ProtectedRoute } from './redux';

export default function App() {
  return (
    <Suspense>
      <GlobalLoader>
        <Router>
          <Menu />
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route index path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/main-menu"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route index path="/downloading" element={<Downloading />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/mods" element={<Mods />} />
          </Routes>
        </Router>
      </GlobalLoader>
      <Notifications />
    </Suspense>
  );
}
