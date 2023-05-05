import { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ProtectedRoute, UserContextProvider } from './auth';
import { Login, Main, Registration, Settings } from './components';

export default function App() {
  return (
    <Suspense>
      <UserContextProvider>
        <Router>
          <Routes>
            <Route index path="/" element={<Login />} />
            <Route index path="/login" element={<Login />} />
            <Route
              path="/main-menu"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            {/* add protected route for settings */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/registration" element={<Registration />} />
            <Route
              path="/forgot-password"
              element={<h1 className="bg-black">RESET PASSOWORD</h1>}
            />
          </Routes>
        </Router>
      </UserContextProvider>
    </Suspense>
  );
}
