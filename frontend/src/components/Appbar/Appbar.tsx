import React, { useContext, useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import useStyles from './Appbar.styles';

export default function Appbar() {
  const classes = useStyles();
  const { token, setToken } = useContext(AppContext);
  // const token = document.cookie.indexOf('token=');  // workaround

  // useEffect(() => {
  //   // This is similar to componentDidMount
  //   const tokenValue = document.cookie.replace('token=', '');
  //   // TODO valdiate token
  //   // if (tokenValue) setToken(tokenValue);
  // });

  // TODO check if user is logged
  // ! workaround for testing purpose - change this for proper user validation (use Context)
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
                  setToken('');
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
