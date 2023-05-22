import { Suspense, useEffect, useContext } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useTranslation } from 'react-i18next';
import { ProtectedRoute, ErrorContext } from './context';
import { Login, Main, Registration, Settings, Downloading } from './components';
import { SettingsList, ISettings } from './types';
import { saveMultipleSettingsOptions } from './components/pages/Settings/utils';

const DEFAULT_INITIAL_SETTINGS: ISettings = {
  isInitial: false,
  '-Xmx': 2,
  '-Dorg_lwjgl_opengl_Window_undecorated': false,
  '--server': null,
};

export default function App() {
  const { showError } = useContext(ErrorContext);
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
        showError({
          message: t('FAILED_TO_CREATE_INITIAL_SETTINGS'),
          nativeError: error,
        })
      );
  }, [t, showError]);

  return (
    <Suspense>
      <Router>
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
