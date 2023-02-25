import { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  user: any;
  redirectPath?: string;
  children: ReactNode;
};

function ProtectedRoute(props: Props) {
  const { user, redirectPath = '/login', children } = props;

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
