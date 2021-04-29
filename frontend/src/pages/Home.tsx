import React from 'react';
// import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor/TextEditor';
import FilePage from './FilePage/FilePage';

const useStyles = makeStyles((theme) => ({
  editPageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
    height: '80vh ',
    // alignItems: 'flex-start',
  },
  sidebar: {
    marginLeft: 20,
  },
  editor: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.editPageContainer}>
        <h1>Home</h1>
      </div>
    </div>
  );
}
