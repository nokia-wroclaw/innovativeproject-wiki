import React, { useState } from 'react';
import { Grid, Paper, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import useStyles from './Workspaces.style';

export default function Home() {
  const classes = useStyles();

  
  const [workspaces, setWorkspaces] = useState([
    {"name": "Workspace 1", "lastUpdate": "25.04.2021"},
    {"name": "Workspace 2", "lastUpdate": "14.04.2021"},
    {"name": "Workspace 3", "lastUpdate": "10.04.2021"},
    {"name": "Workspace 4", "lastUpdate": "05.04.2021"},
    {"name": "Workspace 5", "lastUpdate": "27.03.2021"},
    {"name": "Workspace 6", "lastUpdate": "26.03.2021"}
  ])


  return (
    <div>
    
      <Paper elevation={10} className={classes.paper}>
        
        <h4 className={classes.nameTitle}> Name </h4>
        <h4 className={classes.lastUpdateTitle}> Last Update </h4>
        
        <Grid
            container
            direction="column"
            alignItems="center"
            spacing={1}
            className={classes.workspacesContainer}
        >
            <Grid item direction="column">
                <Paper elevation={3} className={classes.workspaces}>
                    <div className={classes.nameWorkspace}>
                        {workspaces[0].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[0].lastUpdate}
                    </div>
                </Paper>
            </Grid>
            

            <Grid item>
                <Paper elevation={3}  className={classes.workspaces}>
                    <div className={classes.nameWorkspace}>
                        {workspaces[1].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[1].lastUpdate}
                    </div>
                </Paper>
            </Grid>

            <Grid item>
                <Paper elevation={3}  className={classes.workspaces}>
                     <div className={classes.nameWorkspace}>
                        {workspaces[2].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[2].lastUpdate}
                    </div>
                </Paper>
            </Grid>

            <Grid item>
                <Paper elevation={3}  className={classes.workspaces}>
                     <div className={classes.nameWorkspace}>
                        {workspaces[3].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[3].lastUpdate}
                    </div>
                </Paper>
            </Grid>

            <Grid item>
                <Paper elevation={3}  className={classes.workspaces}>
                    <div className={classes.nameWorkspace}>
                        {workspaces[4].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[4].lastUpdate}
                    </div>
                </Paper>
            </Grid>

            <Grid item>
                <Paper elevation={3}  className={classes.workspaces}>
                    <div className={classes.nameWorkspace}>
                        {workspaces[5].name}
                    </div>
                    <div className={classes.lastUpdateWorkspace}>
                        {workspaces[5].lastUpdate}
                    </div>
                </Paper>
            </Grid>

        </Grid>

        <Grid className={classes.pages}>
            <h4> 1 2 3 4 5 ... 99 </h4>
        </Grid>

      </Paper>


      <Grid 
       container 
       alignItems="center" 
       direction="column" 
       spacing={4} 
       className={classes.deleteContainer}>

        <Grid item>  
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

        <Grid item className={classes.button2}> 
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

        <Grid item className={classes.button3}> 
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

        <Grid item className={classes.button4}> 
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

        <Grid item className={classes.button5}> 
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

        <Grid item className={classes.button6}> 
            <IconButton className={classes.deleteButton}>
                <DeleteIcon />
            </IconButton>
        </Grid> 

      </Grid>

    </div>
    
  );
}