import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper, Box } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import BuildIcon from '@material-ui/icons/Build';
import useStyles from './Home.styles';

export default function Home() {
  const classes = useStyles();

  return (
    <div>
    
      <Paper elevation={2} className={classes.homeTitlePaper}>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
        > 
          InnoDocs        
        </Grid>
      </Paper>

      <Grid 
        container
        justify="center"
        spacing={5}
        >

        <Grid item> 
          <Paper elevation={2} className={classes.featurePaper}>
            <CreateIcon className={classes.penIcon}/>
              EASY-TO-USE
          </Paper>
        </Grid>

        <Grid item >
          <Paper elevation={2} className={classes.featurePaper}>
            <SearchIcon className={classes.searchIcon}/>
              SEARCHEABLE
          </Paper>
        </Grid>

        <Grid item>
          <Paper elevation={2} className={classes.featurePaper}>
            <SettingsIcon className={classes.settingsIcon}/>  
              CONFIGURABLE

          </Paper>
        </Grid>

      </Grid>

      <Button
        className={classes.demoButton}
        variant="contained"
        color="primary"
        to="/editor"component={Link}
        endIcon={<BuildIcon/>}
      >
        Go to Editor Demo Page
      </Button>

    </div>
    
  );
}
