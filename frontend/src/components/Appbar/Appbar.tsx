import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCookie, getCookie } from '../../contexts/Cookies';
import useStyles from './Appbar.styles';

export default function Appbar() {
  const classes = useStyles();
  const [image, setImage] = useState('');
  const [token, setToken] = useState(getCookie('token'));

  const fetchPhoto = async () => {
    try {
      const response = await fetch('/api/user/profile_picture', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.blob();
      setImage(URL.createObjectURL(data));
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    
    // setToken(getCookie('token'));
    window.setInterval(() => {
      fetchPhoto();
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
                <Avatar alt="Profile" src={image} className={classes.avatar}/>
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
