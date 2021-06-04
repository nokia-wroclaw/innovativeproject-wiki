import React, { useState, useEffect } from 'react';
import './App.css';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';
import { getCookie } from './contexts/Cookies';

export default function App() {
  const [token, setToken] = useState(getCookie('token'));

  useEffect(() => {
    window.setInterval(() => {
      const tempToken = getCookie('token');
      if (tempToken && typeof tempToken !== 'undefined') setToken(tempToken);
      else setToken('');
    }, 100); // run every 100 ms
  }, []);
  return <div>{token ? <AuthenticatedApp /> : <UnauthenticatedApp />}</div>;
}
