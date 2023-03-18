import { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Login, Main } from './components';
import { ProtectedRoute, UserContextProvider } from './auth';

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
          </Routes>
        </Router>
      </UserContextProvider>
    </Suspense>
  );
}
