import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import './UserData.css';
import useStyles from './UserData.styles';
import { AppContext } from '../../contexts/AppContext';

export default function UserData() {
  const [username, setUsername] = useState('Default username');
  const [mail, setMail] = useState('Default email');
  const { token, setToken } = useContext(AppContext);

  useEffect(() => {
    if (token) {
      fetch('/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success: ', data);
          setUsername(data.username);
          setMail(data.email);
          console.log(data.email);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  }, [mail, token, username]);

  return (
    <div>
      <div id="dataContainer" className="shadow1">
        <div id="title">My Profile</div>

        <div style={{ clear: 'both' }} />

        <div id="ppContainer">
          <div id="imageContainer" />

          <Button
            type="submit"
            variant="contained"
            size="small"
            id="uploadButton"
            onClick={() => console.log('Change profile picture')}
          >
            Upload image
          </Button>
        </div>

        <div id="infoContainer">
          <div style={{ marginTop: '50px' }}>
            <TextField
              id="usernameInput"
              // defaultValue = "Workata"
              value={username}
              helperText="Username"
              fullWidth
              variant="filled"
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <TextField
              id="mailInput"
              // defaultValue = "examplemail@gmail.com"
              value={mail}
              helperText="Email"
              fullWidth
              variant="filled"
            />
          </div>
        </div>

        <div style={{ clear: 'both' }} />

        <div id="passwordContainer">
          <div style={{ float: 'left', marginLeft: '80px' }}>
            <TextField
              id="newPassInput"
              // className={classes.passTextField}
              // defaultValue=""
              helperText="New password"
              variant="filled"
              type="password"
            />
          </div>

          <div style={{ float: 'left', marginLeft: '100px' }}>
            <TextField
              id="confirmPassInput"
              // defaultValue=""
              helperText="Confirm password"
              variant="filled"
              type="password"
            />
          </div>

          <div style={{ clear: 'both' }} />
        </div>

        <div style={{ clear: 'both' }} />

        <Button
          type="submit"
          color="primary"
          variant="contained"
          size="medium"
          id="saveButton"
          onClick={() => console.log('Save')}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
