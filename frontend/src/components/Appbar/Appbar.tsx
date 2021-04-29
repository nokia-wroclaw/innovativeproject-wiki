import React, { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import { Link } from 'react-router-dom';
import {AppContext} from '../../contexts/AppContext'
import useStyles from './Appbar.styles';

export default function Appbar() {
  const classes = useStyles();
  const {user} = useContext(AppContext)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            to="/"  
            component={Link}
            align="left"
          >
            InnoDocs
          </Typography>

          <Button color="inherit" to="/login" component={Link}>
            Login
          </Button>
          <Button color="inherit" to="/register" component={Link}>
            Register
          </Button>
          
        </Toolbar>
      </AppBar>
    </div>
  );
}
