import React, { useState } from 'react';

type ContextProps = {
  user: string | null;
  setUser: (user: string | null) => void;
  selectedWorkspace: string | null;
  setSelectedWorkspace: (workspace: string | null) => void;
};

export const AppContext = React.createContext<ContextProps>({
  user: 'user',
  setUser: (user: string | null) => {},
  selectedWorkspace: '',
  setSelectedWorkspace: (workspace: string | null) => {},
});

export default function ContextProvider(props: { children: React.ReactChild }) {
  const [user, setUser] = useState<null | string>('user');
  const [selectedWorkspace, setSelectedWorkspace] = useState<null | string>('');

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedWorkspace,
        setSelectedWorkspace,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
