import { ReactElement, Suspense, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  addNotification,
  AppState,
  Notifications,
  ProtectedRoute,
} from './redux';

const DEFAULT_INITIAL_SETTINGS: ISettings = {
  isInitial: false,
  memoryUsage: 2,
  fullscreen: false,
  autoJoin: false,
  isDebug: false,
};

function Loader(): ReactElement {
  return (
    <div className="absolute left-0 top-0 z-[999] flex h-full w-full flex-col items-center justify-center bg-black/80">
      <div className="loading-animation" />
    </div>
  );
}

export default function App() {
  const dispatch = useDispatch();
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
        dispatch(
          addNotification({
            message: t('FAILED_TO_CREATE_INITIAL_SETTINGS'),
            nativeError: error,
            type: LauncherLogs.error,
          })
        )
      );
  }, []);

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
