import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from '../../components/Sidebar/Sidebar';
import TextEditor from '../../components/TextEditor/TextEditor';

const useStyles = makeStyles((theme) => ({
  editPageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sidebar: {
    margin: 40,
  },
  editor: {
    margin: 40,
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FilePage({ match }: { match: any }) {
  const classes = useStyles();
  const { fileName } = match.params;

  return (
    <div className={classes.editPageContainer}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.editor}>
        <TextEditor fileName={fileName} />
      </div>
    </div>
  );
}
