import { useState, createContext, ReactNode, ReactElement } from 'react';

export interface IUserContextData {
  access: string;
  username: string;
}

interface IUserContext {
  userData: IUserContextData;
  /* eslint-disable-next-line no-unused-vars */
  setUserData: (data: IUserContextData) => void;
  clearUserData: () => void;
}

export const UserContext = createContext<IUserContext>({
  userData: { access: '', username: '' },
  /* eslint-disable-next-line no-unused-vars */
  setUserData: (data: IUserContextData) => {},
  clearUserData: () => {},
});

type Props = {
  children: ReactNode;
};

function UserContextProvider(props: Props): ReactElement {
  const { children } = props;

  const [user, setUser] = useState({
    userData: { access: '', username: '' },
    setUserData: (userData: IUserContextData): void =>
      setUser({ ...user, userData }),
    clearUserData: () =>
      setUser({ ...user, userData: { access: '', username: '' } }),
  });

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
