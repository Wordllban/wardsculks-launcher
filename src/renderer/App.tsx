import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const handleOpenMozila = () => {
    window.electron.ipcRenderer.sendMessage('browser-open', ['open browser']);
  };

  return (
    <div>
      <a className="text-5xl">WardSculks</a>
      <button onClick={handleOpenMozila}>Open</button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
