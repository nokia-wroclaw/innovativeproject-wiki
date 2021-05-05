import React, { useContext } from 'react';
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
  const { user } = useContext(AppContext);

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
          <div className={classes.buttons}>
            <Button color="inherit" to="/login" component={Link}>
              Login
            </Button>
            <Button color="inherit" to="/register" component={Link}>
              Register
            </Button>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
