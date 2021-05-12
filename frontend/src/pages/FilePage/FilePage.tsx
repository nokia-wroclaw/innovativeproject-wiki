import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Sidebar from '../../components/Sidebar/Sidebar';
import TextEditor from '../../components/TextEditor/TextEditor';
import { AppContext } from '../../contexts/AppContext';
import UndrawWallpost from '../../images/UndrawWallpost.svg';
import useStyles from './FilePage.styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FilePage({ match }: { match: any }) {
  const classes = useStyles();
  const { fileName, workspaceName } = match.params;
  const selectedWorkspace = workspaceName;
  // const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);
  const [itemList, setItemList] = useState([]);

  const fetchFiles = () => {
    fetch(`/workspace/translate/${selectedWorkspace}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setItemList(data);
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className={classes.filePageContainer}>
      <div className={classes.sidebar}>
        <Sidebar />
      </div>
      <div className={classes.editor}>
        {/* {itemList.length !== 0 ? (
          <TextEditor fileName={fileName} />
        ) : (
          <TextEditor fileName="dcdc" />
        )} */}
        <TextEditor fileName={fileName} workspaceName={workspaceName} />
      </div>

      <div className={classes.filePage_buttons}>
        <Button
          variant="contained"
          color="primary"
          className={classes.filePage_buttons}
          startIcon={<CloudDownloadIcon />}
        >
          Export
        </Button>
      </div>
    </div>
  );
}
