import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import useStyles from './Home.styles';
import UndrawDocs from '../../images/UndrawDocs.svg';
import UndrawCloud from '../../images/UndrawCloud.svg';
import UndrawPersonal from '../../images/UndrawPersonal.svg';
import UndrawDocuments from '../../images/UndrawDocuments.svg';
import UndrawMyFiles from '../../images/UndrawMyFiles.svg';

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h2" className={classes.homepage__title}>
        InnoDocs
      </Typography>
      <Typography variant="h6" className={classes.homepage__subtitle}>
        Free and Open Source web app perfect for making documentation intended
        for use in small to moderate sized teams
      </Typography>
      {/* <div className={classes.homepage__buttons}>
         <Button
          variant="contained"
          color="primary"
          to="/workspaces"
          component={Link}
          endIcon={<BuildIcon />}
          className={classes.homepage__button}
        >
          Workspaces
       </Button> 
      </div> */}
      <div className={classes.homepage__cards}>
        <div className={classes.homepage__card}>
          <img
            src={UndrawMyFiles}
            alt="UndrawMyFiles"
            className={classes.homepage__undraw}
          />
          <Typography variant="h3">EASY-TO-USE</Typography>
        </div>
        <div className={classes.homepage__card}>
          <Typography variant="h3">CONFIGURABLE</Typography>
          <img
            src={UndrawCloud}
            alt="UndrawCloud"
            className={classes.homepage__undraw}
          />
        </div>
        <div className={classes.homepage__card}>
          <img
            src={UndrawPersonal}
            alt="UndrawPersonal"
            className={classes.homepage__undraw}
          />
          <Typography variant="h3">SEARCHABLE</Typography>
        </div>
      </div>
    </div>
  );
}
