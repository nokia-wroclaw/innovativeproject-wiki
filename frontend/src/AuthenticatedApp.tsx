import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import Workspaces from './pages/Workspaces/Workspaces';
import LoginHomePage from './pages/LoginHomePage/LoginHomePage';
import FilePage from './pages/FilePage/FilePage';
import UserData from './pages/UserData/UserData';
import ContextProvider from './contexts/AppContext';
import UndrawPageNotFound from './images/UndrawPageNotFound.svg';
import './App.css';

export default function AuthenticatedApp() {
  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <div className="Appbar">
            <Appbar />
          </div>
          <Switch>
            <Route exact path="/" component={LoginHomePage} />
            <Route exact path="/workspaces" component={Workspaces} />
            <Route
              exact
              path="/workspaces/:workspaceName"
              component={FilePage}
            />
            <Route
              exact
              path="/workspaces/:workspaceName/:fileName"
              component={FilePage}
            />

            <Route exact path="/userData" component={UserData} />
            {/* <Route exact path="/lastActivity" component={LastActivity} /> */}
            {/* <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} /> */}
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
