import {
  Button,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useStyles from './Register.styles';

const Register: React.FC = () => {
  const classes = useStyles();

  const [typedUsername, setTypedUsername] = useState('');
  const [usernameErrorMsg, setUsernameErrorMsg] = useState('');

  const [typedPassword, setTypedPassword] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  const [typedRepeatPassword, setTypedRepeatPassword] = useState('');
  const [repeatPassErrorMsg, setRepeatPassErrorMsg] = useState('');

  const [typedEmail, setTypedEmail] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');

  const history = useHistory();

  const handleRegisterButton = async () => {
    // validation before fetch
    if(!typedUsername || !typedPassword || !typedRepeatPassword || !typedEmail ||
      usernameErrorMsg || passErrorMsg || repeatPassErrorMsg || emailErrorMsg) 
    return;

    fetch('/auth/register', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: typedUsername,
        password: typedPassword,
        scope: typedEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        history.push('/login');
      })
      .catch((error) => {
        console.error('Error:');
      });
  };



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
            error={!(!usernameErrorMsg)}
            label="Username"
            placeholder="Enter username"
            fullWidth
            helperText={usernameErrorMsg}
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              // username validation
              if(value == '') setUsernameErrorMsg("");   // reset error msg if blank
              else if (!/^[a-z0-9_-]+$/i.test(value)) setUsernameErrorMsg("Username should be alphanumeric");
              else setUsernameErrorMsg(""); 
            
              setTypedUsername(value);
              
            }}
          />
          
          <TextField
            error={!(!emailErrorMsg)}
            label="Email"
            placeholder="Enter email"
            type="email"
            fullWidth
            helperText={emailErrorMsg}
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              // email validation
              if(value == "") setEmailErrorMsg("");   // reset error msg if blank
              else if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)) setEmailErrorMsg("Input correct email");
              else setEmailErrorMsg("");
              
              setTypedEmail(value);
              
            }}
          />
          
          <TextField
            error={!(!passErrorMsg)}
            label="Password"
            placeholder="Enter password"
            type="password"
            fullWidth
            helperText={passErrorMsg}
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              // password validation
              if(value == '') setPassErrorMsg("");   // reset error msg if blank
              else if (value.length < 8) setPassErrorMsg("Password is too short");
              else if(value == value.toUpperCase()) setPassErrorMsg("Input at least one small letter");
              else if(value == value.toLowerCase()) setPassErrorMsg("Input at least one big letter");
              else setPassErrorMsg("");

              setTypedPassword(value);
            }}
          />

          <TextField
            error={!(!repeatPassErrorMsg)}
            label="Password confirmation"
            placeholder="Re-enter password"
            type="password"
            fullWidth
            helperText={repeatPassErrorMsg}
            className={classes.registerTextField}
            onChange={({ target: { value } }) => {
              // re-password validation
              if(value == '') setRepeatPassErrorMsg("");   // reset error msg if blank
              else if (value != typedPassword) setRepeatPassErrorMsg("Passwords don't match");
              else setRepeatPassErrorMsg(""); // validation complete

              setTypedRepeatPassword(value);
            }}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            className={classes.registerButton}
            onClick={() => handleRegisterButton()}
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
