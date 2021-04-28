import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Appbar from './components/Appbar/Appbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Sidebar from './components/Sidebar/Sidebar';
import FilePage from './pages/FilePage/FilePage';
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
            <Route exact path="/:fileName" component={FilePage} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </div>
      </Router>
    </ContextProvider>
  );
}

export default App;
