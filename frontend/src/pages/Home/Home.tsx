import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Paper } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import SearchIcon from '@material-ui/icons/Search';
import useStyles from './Home.styles';

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Button color="primary" to="/editor"component={Link}>
        Go to Editor Page
      </Button>
      <Paper elevation={10} className={classes.homeTitlePaper}>
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
        direction="row"
        justify="space-around"
        alignItems="center"
        >
        <Grid> 
          <Paper elevation={5} square={false} className={classes.firstFeaturePaper}>
            <CreateIcon className={classes.firstFeature}/>
              EASY-TO-USE
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={5} className={classes.firstFeaturePaper}>
            <SearchIcon className={classes.secondFeature}/>
              SEARCHEABLE
          </Paper>
        </Grid>
        <Grid>
          <Paper elevation={5} className={classes.firstFeaturePaper}>
            <SettingsIcon className={classes.thirdFeature}/>
              CONFIGURABLE
          </Paper>
        </Grid>
      </Grid>
    </div>
    
    
  );
}
