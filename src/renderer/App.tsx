import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import background from '../../assets/images/background.png';
import './App.css';
import Layout from './components/common/Layout/Layout';

function Hello() {
  const handleOpenMozila = () => {
    window.electron.ipcRenderer.sendMessage('browser-open', ['open browser']);
  };

  return <Layout />;
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
