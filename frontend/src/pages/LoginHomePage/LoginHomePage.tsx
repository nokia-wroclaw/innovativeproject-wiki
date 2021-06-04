import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import UndrawTeam from '../../images/UndrawTeam.png';
import { getCookie } from '../../contexts/Cookies';
import useStyles from './LoginHomePage.styles';


export default function LastActivity() {
  const classes = useStyles();
  const [username, setUsername] = useState('');

  const fetchUserData = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch('/api/authorization/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log(data);
      setUsername(data.username);
    } catch (error) {
      console.error('Error: ', error);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
    <Typography variant="h2" className={classes.homepage__title}>
        Welcome to InnoDocs, <span className={classes.username} >{username}</span>!
    </Typography>

    <Card className={classes.root}>
      <CardActionArea to="/workspaces" component={Link}>
        <CardMedia
          className={classes.media}
          src={UndrawTeam}
         
          title="Your Workspaces"
          component="img"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Workspaces
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Make yourself comfortable and start working in your own workspaces!
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div> 
  );
}