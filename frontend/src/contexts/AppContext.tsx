import React, { useState } from 'react';

type ContextProps = {
  user: string | null;
  setUser: (user: string | null) => void;
};

export const AppContext = React.createContext<ContextProps>({
  user: 'user',
  setUser: (user: string | null) => {},
});

export default function ContextProvider(props: { children: React.ReactChild }) {
  const [user, setUser] = useState<null | string>('user');

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {props.children}
    </AppContext.Provider>
  );
}
