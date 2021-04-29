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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FilePage({ match }: { match: any }) {
  const classes = useStyles();
  const { fileName } = match.params;

  return (
    <div className={classes.editPageContainer}>
      <Sidebar />
      <div className={classes.editor}>
        <TextEditor fileName={fileName} />
      </div>
    </div>
  );
}
