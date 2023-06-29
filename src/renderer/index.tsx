import { createRoot } from 'react-dom/client';
import App from './App';
import './locales/i18n';
import { UserContextProvider, ErrorContextProvider } from './context';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <UserContextProvider>
    <ErrorContextProvider>
      <App />
    </ErrorContextProvider>
  </UserContextProvider>
);
