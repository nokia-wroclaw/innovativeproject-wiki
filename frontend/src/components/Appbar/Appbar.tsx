import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import useStyles from './Appbar.styles';

export default function Appbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            to="/"
            component={Link}
          >
            InnoDocs
          </Typography>
          <Container className={classes.buttons}>
            <Button color="inherit" to="/login" component={Link}>
              Login
            </Button>
            <Button color="inherit" to="/register" component={Link}>
              Register
            </Button>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  );
}
