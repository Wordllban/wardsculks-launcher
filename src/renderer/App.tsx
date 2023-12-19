import { useState, ReactElement, Suspense } from 'react';
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
  ForgotPassword,
  Mods,
} from './components';
import { AppState, Notifications, ProtectedRoute } from './redux';

// todo: move global loader to separate component wrapper file

function GlobalLoader(): ReactElement {
  return (
    <div className="absolute left-0 top-0 z-[99] flex h-full w-full flex-col items-center justify-center bg-black/70">
      <div className="loading-animation" />
    </div>
  );
}

export default function App() {
  const [appUpdating, setAppUpdating] = useState<boolean>(false);
  const isFetching: boolean = useSelector(
    (state: AppState) =>
      state.auth.isLoading || state.main.isLoading || state.server.isLoading
  );

  const isLoading = appUpdating || isFetching;

  window.electron.ipcRenderer.on('app-update-downloading', (value: boolean) => {
    setAppUpdating(value);
  });

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/mods" element={<Mods />} />
          </Routes>
        </Router>
        <Notifications />
      </Suspense>
      {isLoading && <GlobalLoader />}
    </div>
  );
}
