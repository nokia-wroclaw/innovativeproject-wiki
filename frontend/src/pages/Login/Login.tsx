import {
  Button,
  Checkbox,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setCookie } from '../../contexts/Cookies';
import useStyles from './Login.styles';

const Login: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [typedUsername, setTypedUsername] = useState('');
  const [typedPassword, setTypedPassword] = useState('');

  const handleLoginButton = async () => {
    fetch('/auth/login', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: typedUsername,
        password: typedPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCookie('token', data.access_token);

        history.push('/workspaces');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Paper elevation={10} className={classes.loginPaper}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <h2>Sign In</h2>
          <TextField
            label="Username"
            placeholder="Enter username"
            type="username"
            fullWidth
            className={classes.loginTextField}
            onChange={({ target: { value } }) => {
              setTypedUsername(value);
            }}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            className={classes.loginTextField}
            onChange={({ target: { value } }) => {
              setTypedPassword(value);
            }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.loginButton}
            onClick={() => handleLoginButton()}
          >
            Sign in
          </Button>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />
          <Typography>
            <Link href="#">Forgot password?</Link>
          </Typography>
          <Typography>
            {' '}
            Do you have an account?<Link href="/register"> Sign Up</Link>
          </Typography>
        </Grid>
      </Paper>
    </div>
  );
};

export default Login;
