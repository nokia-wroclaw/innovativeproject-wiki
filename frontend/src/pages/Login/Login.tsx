import React, { useState, useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  Paper,
  Checkbox,
  Typography,
  Link,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AppContext } from '../../contexts/AppContext';
import useStyles from './Login.styles';

const Login: React.FC = () => {
  const classes = useStyles();
  const { user, setUser } = useContext(AppContext);
  const [typedUsername, setTypedUsername] = useState('');
  const [typedPassword, setTypedPassword] = useState('');

  const checkLogin = async () => {
    try {
      // TODO - change proxy to 5000
      const response = await fetch(`/user`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: typedUsername,
          password: typedPassword,
        }),
      });
      const isCorrect: boolean = await response.json();
      return isCorrect;
    } catch {
      return false;
    }
  };

  const handleLoginButton = () => {
    checkLogin().then((isCorrect) => {
      if (isCorrect === true) {
        console.log('login success');
        // TODO - set user in context
      } else {
        console.log('login fail');
      }
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
