/* eslint-disable react/jsx-no-useless-fragment */
import { ReactElement, ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

type Props = {
  redirectPath?: string;
  children: ReactNode;
};

function ProtectedRoute(props: Props): ReactElement {
  const { redirectPath = '/login', children } = props;

  const { userData } = useContext(UserContext);

  if (!userData.access) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
