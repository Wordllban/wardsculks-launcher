import { Suspense, useEffect, useContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute, LoggerContext } from './context';
import {
  Login,
  Main,
  Registration,
  Settings,
  Downloading,
  Menu,
} from './components';
import { SettingsList, ISettings } from './types';
import { LauncherLogs } from '../types';
import { saveMultipleSettingsOptions } from './components/pages/Settings/utils';

const DEFAULT_INITIAL_SETTINGS: ISettings = {
  isInitial: false,
  memoryUsage: 2,
  fullscreen: false,
  autoJoin: false,
};

export default function App() {
  const { showMessage } = useContext(LoggerContext);
  const { t } = useTranslation();

  /**
   * Create initial settings when app first time opened
   */
  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('has-setting', [SettingsList.isInitial])
      .then((isInitialSettings: boolean) => {
        if (!isInitialSettings) {
          return saveMultipleSettingsOptions(DEFAULT_INITIAL_SETTINGS);
        }
        return isInitialSettings;
      })
      .catch((error) =>
        showMessage({
          message: t('FAILED_TO_CREATE_INITIAL_SETTINGS'),
          nativeError: error,
          type: LauncherLogs.error,
        })
      );
  }, []);

  return (
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
    </Suspense>
  );
}
