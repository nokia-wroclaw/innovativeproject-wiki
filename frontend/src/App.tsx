import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import Workspaces from './pages/Workspaces/Workspaces';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import FilePage from './pages/FilePage/FilePage';
import UserData from './pages/UserData/UserData';
import LastActivity from './pages/LastActivity/LastActivity';
import ContextProvider from './contexts/AppContext';
import './App.css';

function App() {
  return (
    <ContextProvider>
      <Router>
        <div className="App">
          <div className="Appbar">
            <Appbar />
          </div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/workspaces" component={Workspaces} />
            <Route exact path="/userData" component={UserData} />
            <Route exact path="/lastActivity" component={LastActivity} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/editor" component={FilePage} />
            <Route exact path="/editor/:fileName" component={FilePage} />
          </Switch>
        </div>
      </Router>
    </ContextProvider>
  );
}

export default App;
