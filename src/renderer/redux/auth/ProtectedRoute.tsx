/* eslint-disable react/jsx-no-useless-fragment */
import { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../store';

type Props = {
  redirectPath?: string;
  children: ReactNode;
};

function ProtectedRoute(props: Props): ReactElement {
  const { redirectPath = '/login', children } = props;

  const access = useSelector((state: AppState) => state.auth.access);

  if (!access) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
