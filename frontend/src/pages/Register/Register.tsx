import React, { useState, useContext } from 'react';
import { Grid, TextField, Button, Paper, Checkbox, Typography, Link } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AppContext } from '../../contexts/AppContext';
import useStyles from './Register.styles';


const Register: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const [typedUsername, setTypedUsername] = useState('');
  const [typedPassword, setTypedPassword] = useState('');
  const [typedEmail, setTypedEmail] = useState('');

  return (
    <div>
      <Paper elevation={10} className={classes.registerPaper}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
          <h2>Sign Up</h2>
          <TextField
            label="Username"
            placeholder="Enter username"
            fullWidth
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              setTypedUsername(value);
            }}
          />
          <TextField
            label="Email"
            placeholder="Enter email"
            type="email"
            fullWidth
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              setTypedEmail(value);
            }}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              setTypedPassword(value);
            }}
          />
          <TextField
            label="Password confirmation"
            placeholder="Re-enter password"
            type="password"
            fullWidth
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              setTypedPassword(value);
            }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.registerButton}
          >
            Sign up
          </Button>
          <Typography>
            {' '}
            Already have an account?<Link href="/login"> Sign In</Link>
          </Typography>
        </Grid>
      </Paper>
    </div>
  );
};

export default Register;