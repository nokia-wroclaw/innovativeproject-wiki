import React, { useContext, useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { setCookie, getCookie, deleteCookie } from '../../contexts/Cookies';

import useStyles from './Appbar.styles';

export default function Appbar() {
  const classes = useStyles();
  const [token, setToken] = useState(getCookie('token'));

  useEffect(() => {
    // setToken(getCookie('token'));
    window.setInterval(() => {
      const tempToken = getCookie('token');
      if (tempToken) setToken(tempToken);
      else setToken('');
    }, 100); // run every 100 ms
  }, []);

  // TODO check if user is logged
  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.root}>
          <Typography
            variant="h6"
            className={classes.title}
            to="/"
            component={Link}
            align="left"
          >
            InnoDocs
          </Typography>
          {!token ? (
            <div className={classes.buttons}>
              <Button color="inherit" to="/login" component={Link}>
                Login
              </Button>
              <Button color="inherit" to="/register" component={Link}>
                Register
              </Button>
            </div>
          ) : (
            <div className={classes.buttons}>
              <Button color="inherit" to="/userData" component={Link}>
                Profile
              </Button>
              <Button
                color="inherit"
                to="/"
                component={Link}
                onClick={() => {
                  deleteCookie('token', '/');
                }}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
