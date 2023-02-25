import { Suspense } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './auth/ProtectedRoute';
import { Login, Main } from './components';

export default function App() {
  return (
    <Suspense>
      <Router>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route index path="/login" element={<Login />} />
          <Route
            path="/main-menu"
            element={
              <ProtectedRoute user="asdas">
                <Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Suspense>
  );
}
