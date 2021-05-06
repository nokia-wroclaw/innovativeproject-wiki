import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Sidebar from '../../components/Sidebar/Sidebar';
import TextEditor from '../../components/TextEditor/TextEditor';
import useStyles from './FilePage.styles';
/*
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
}));  */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FilePage({ match }: { match: any }) {
  const classes = useStyles();
  const { fileName } = match.params;

  return (
    <div className={classes.filePageContainer}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.editor}>
        <TextEditor fileName={fileName} />
      </div>

      <div className={classes.filePage_buttons}>
        <Button
          variant="contained"
          color="primary"
          className={classes.filePage_buttons}
          startIcon={<CloudDownloadIcon/>}
        >
          Export
        </Button>
        </div>
    </div>
  );
}
