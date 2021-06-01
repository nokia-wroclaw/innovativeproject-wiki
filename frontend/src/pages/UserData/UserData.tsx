import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getCookie } from '../../contexts/Cookies';
import './UserData.css';

export default function UserData() {
  const [username, setUsername] = useState('Default username');
  const [mail, setMail] = useState('Default email');
  const [image, setImage] = useState('');

  const fetchPhoto = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('/user/profile_picture', {
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

  const fetchUserData = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('/authorization/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log(data);
      setUsername(data.username);
      setMail(data.email);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPhoto();
  }, [mail, username]);

  return (
    <div>
      <div id="dataContainer" className="shadow1">
        <div id="title">My Profile</div>

        <div style={{ clear: 'both' }} />

        <div id="ppContainer">
          <img src={image} alt="Italian Trulli" id="imageContainer" />

          <Button
            type="submit"
            variant="contained"
            size="small"
            id="uploadButton"
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
