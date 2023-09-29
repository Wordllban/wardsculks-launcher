import { ReactElement, Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useSelector } from 'react-redux';
import {
  Login,
  Main,
  Registration,
  Settings,
  Downloading,
  Menu,
} from './components';
import { AppState, Notifications, ProtectedRoute } from './redux';

function Loader(): ReactElement {
  return (
    <div className="absolute left-0 top-0 z-[999] flex h-full w-full flex-col items-center justify-center bg-black/80">
      <div className="loading-animation" />
    </div>
  );
}

export default function App() {
  const isLoading: boolean = useSelector(
    (state: AppState) => state.auth.isLoading || state.main.isLoading
  );

  return (
    <div className="relative">
      <Suspense>
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
            <Route
              path="/forgot-password"
              element={<h1 className="bg-black">RESET PASSOWORD</h1>}
            />
          </Routes>
        </Router>
        <Notifications />
      </Suspense>
      {isLoading && <Loader />}
    </div>
  );
}
