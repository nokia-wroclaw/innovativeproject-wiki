import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor';
import TextEditor2 from '../components/TextEditor2';

const useStyles = makeStyles((theme) => ({
  editor: {
    marginLeft: '100 px',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignContent: 'space-between',
  },
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <Button color="primary" to="/about" component={Link}>
        Go to About
      </Button>
      {/* <TextEditor /> */}
      <div className={classes.editor}>
        <TextEditor2 />
        <Sidebar />
      </div>
    </div>
  );
}
