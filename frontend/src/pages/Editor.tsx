import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor/TextEditor';

const useStyles = makeStyles((theme) => ({
  editPageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-between',
    height: '80vh ',
  },
  sidebar: {
    marginLeft: 20,
    marginTop: 20,
  },
  editor: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));


export default function Editor() {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.editPageContainer}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div className={classes.editor}>
          <TextEditor />
        </div>
      </div>
    </div>
  );
}
