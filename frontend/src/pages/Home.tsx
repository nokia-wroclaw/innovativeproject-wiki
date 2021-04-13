import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor';
import TextEditor2 from '../components/TextEditor2';

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
      <Button color="primary" to="/about" component={Link}>
        Go to About
      </Button>
      <div className={classes.editPageContainer}>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
        <div className={classes.editor}>
          <TextEditor2 />
        </div>
      </div>
    </div>
  );
}
