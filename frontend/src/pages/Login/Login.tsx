import React, { useState, useContext } from 'react';
import { Grid, TextField, Button, Paper, Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AppContext } from '../../contexts/AppContext';
import useStyles from './Login.styles';

const Login: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const [typedUsername, setTypedUsername] = useState('');
  const [typedPassword, setTypedPassword] = useState('');

  return (
    <div>
      <Paper elevation={10} className={classes.loginPaper}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <h2>Log In</h2>
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
          >
            Log in
          </Button>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Remember me"
          />
          {/* <Typography>
            <Link href="#">Forgot password ?</Link>
          </Typography>
          <Typography>
            {' '}
            Do you have an account?<Link href="#"> Sign Up</Link>
          </Typography> */}
        </Grid>
      </Paper>
    </div>
  );
};

export default Login;
