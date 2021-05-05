import React, { useState } from 'react';

type ContextProps = {
  user: string | null;
  setUser: (user: string | null) => void;
  selectedWorkspace: string | null;
  setSelectedWorkspace: (workspace: string | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
};

export const AppContext = React.createContext<ContextProps>({
  user: 'user',
  setUser: (user: string | null) => {},
  selectedWorkspace: '',
  setSelectedWorkspace: (workspace: string | null) => {},
  token: '',
  setToken: (token: string | null) => {},
});

export default function ContextProvider(props: { children: React.ReactChild }) {
  const [user, setUser] = useState<null | string>('user');
  const [selectedWorkspace, setSelectedWorkspace] = useState<null | string>('');
  const [token, setToken] = useState<null | string>('');

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedWorkspace,
        setSelectedWorkspace,
        token,
        setToken,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
