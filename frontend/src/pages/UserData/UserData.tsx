import {
  Paper,
  Button,
  TextField,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { getCookie } from '../../contexts/Cookies';
import useStyles from './UserData.styles';

export default function UserData() {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [open, setOpen] = useState(false);
  const textfieldVariant = 'filled';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postPhoto = async (data: any) => {
    try {
      const token = getCookie('token');

      const formData = new FormData();
      formData.append('new_picture', data);
      const response = await fetch('/user/profile_picture', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(token),
        },
        body: formData,
      });
      fetchPhoto();
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
      setEmail(data.email);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const postUserData = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = {
      username,
      email,
    };
    if (password && confirmPassword && password === confirmPassword) {
      body.password = password;
      console.log(body);
    }

    try {
      const token = getCookie('token');
      const response = await fetch('/user/update_data', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      fetchUserData();
      setOpen(true);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPhoto();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCapture = ({ target }: any) => {
    postPhoto(target.files[0]);
  };

  return (
    <div className={classes.root}>
      <Paper elevation={10} className={classes.paper}>
        <Typography variant="h5">My Profile</Typography>
        <div className={classes.photoAndDataContainer}>
          <div className={classes.photoContainer}>
            <Avatar
              alt="profile"
              src={image}
              className={classes.profilePicture}
            />
            <Button
              variant="contained"
              component="label"
              className={classes.button}
            >
              Upload Photo
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleCapture}
                hidden
              />
            </Button>
          </div>
          <div className={classes.dataContainer}>
            <TextField
              variant={textfieldVariant}
              label="Username"
              type="username"
              fullWidth
              disabled={true}
              value={username}
              onChange={({ target: { value } }) => {
                setUsername(value);
              }}
            />
            <TextField
              variant={textfieldVariant}
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={({ target: { value } }) => {
                setEmail(value);
              }}
            />
          </div>
        </div>
        <div className={classes.passwordsContainer}>
          <TextField
            className={classes.textField}
            variant={textfieldVariant}
            label="New password"
            type="password"
            value={password}
            onChange={({ target: { value } }) => {
              setPassword(value);
            }}
          />
          <TextField
            className={classes.textField}
            variant={textfieldVariant}
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={({ target: { value } }) => {
              setConfirmPassword(value);
            }}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          className={classes.button}
          onClick={postUserData}
        >
          Save
        </Button>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Typography>Changes saved</Typography>
        </DialogContent>
        <DialogActions
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button onClick={() => setOpen(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
