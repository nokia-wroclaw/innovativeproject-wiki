import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import Workspaces from './pages/Workspaces/Workspaces';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ContextProvider from './contexts/AppContext';
import UndrawPageNotFound from './images/UndrawPageNotFound.svg';
import './App.css';

export default function UnauthenticatedApp() {
  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <div className="Appbar">
            <Appbar />
          </div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}
              >
                <img src={UndrawPageNotFound} alt="PageNotFound" />
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    </ContextProvider>
  );
}
