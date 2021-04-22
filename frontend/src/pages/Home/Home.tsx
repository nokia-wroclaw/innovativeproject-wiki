import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper } from '@material-ui/core';
import useStyles from './Home.styles';

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Button color="primary" to="/editor"component={Link}>
        Go to Editor Page
      </Button>
      <Paper elevation={10} className={classes.loginPaper}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        >
        <div style={{fontSize: 180, marginTop: 70}} >
          InnoDocs
        </div>
               
        
        </Grid>
      </Paper>
    </div>
  );
}
