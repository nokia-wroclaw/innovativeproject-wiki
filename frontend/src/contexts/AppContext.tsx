import React, { useState } from 'react';

type ContextProps = {
  user: string;
};

export const AppContext = React.createContext<Partial<ContextProps>>({});

export default function ContextProvider(props: { children: React.ReactChild }) {
  const [user, setUser] = useState('Jessica');
  return (
    <AppContext.Provider value={{ user }}>{props.children}</AppContext.Provider>
  );
}
