import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import './UserData.css';
import useStyles from './UserData.styles';

export default function UserData() {

  useEffect(() =>{
    // This is similar to componentDidMount
    // Call back-end api here
    // console.log(document.cookie.replace('token=', ''));
    const token = document.cookie.replace('token=', '')
    fetch('/auth/me', {
      method: 'GET', // or 'PUT'
      headers: {
        'Authorization': 'Bearer '.concat(token),
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success: ', data);
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
    
  },[])

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
              defaultValue="Workata"
              helperText="Username"
              fullWidth
              variant="filled"
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <TextField
              id="mailInput"
              defaultValue="examplemail@gmail.com"
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
              defaultValue="***********"
              helperText="New password"
              variant="filled"
            />
          </div>

          <div style={{ float: 'left', marginLeft: '100px' }}>
            <TextField
              id="confirmPassInput"
              defaultValue="***********"
              helperText="Confirm password"
              variant="filled"
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
