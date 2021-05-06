import React, { useState, useContext, useEffect } from 'react';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';

import useStyles from './Workspaces.style';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Title',
    width: 380,
    disableClickEventBubbling: true,
  },

  {
    field: 'lastUpdate',
    headerName: 'Last Update',
    width: 380,
    disableClickEventBubbling: true,
  },
  {
    field: 'z',
    headerName: 'Delete',
    sortable: false,
    width: 180,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <IconButton>
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export default function DataTable() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);
  const [typedWorkspaceName, setTypedWorkspaceName] = useState('');
  const [workspaces, setWorkspaces] = useState([
    { id: '', name: '', lastUpdate: '' },
    // { id: 'Workspace_2', name: 'Workspace_2', lastUpdate: '14.04.2021' },
    // { id: 'Workspace_3', name: 'Workspace_3', lastUpdate: '10.04.2021' },
    // { id: 'Workspace_4', name: 'Workspace_4', lastUpdate: '05.04.2021' },
    // { id: 'Workspace_5', name: 'Workspace_5', lastUpdate: '27.03.2021' },
    // { id: 'Workspace_6', name: 'Workspace_6', lastUpdate: '26.03.2021' },
    // { id: '123', name: '123', lastUpdate: '26.03.2021' },
  ]);
  const { token, setToken } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const textFieldClear = () => {
    setTypedWorkspaceName('');
  };

  const removeWorkspace = (id: string) => {
    const found = workspaces.find((workspace) => workspace.id === id);

    if (token && found) {
      fetch(`/workspace/remove/${found.name}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(token),
          // 'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          fetchWorkspaces();
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    // const updatedWorkspaces = [...workspaces];
    // updatedWorkspaces.splice(foundIndex, 1);
    // setWorkspaces(updatedWorkspaces);
  };

  // TODO checkbox private false/true

  const addWorkspace = () => {
    if (
      !workspaces.find((workspace) => workspace.name === typedWorkspaceName) &&
      typedWorkspaceName
    ) {
      setWorkspaces([
        ...workspaces,
        {
          id: typedWorkspaceName,
          name: typedWorkspaceName,
          lastUpdate: '06.05.2021',
        },
      ]);
      textFieldClear();

      if (token) {
        fetch(
          '/workspace/new/'.concat(typedWorkspaceName).concat(`?private=false`),
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      handleClose();
    } else {
      window.alert('The workspace name must be unique!');
    }
  };

  const fetchWorkspaces = () => {
    if (token) {
      fetch('/workspace/get', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success: ', data);
          const newData = data.map(
            (workspace: { name: string; last_updated: string }) => ({
              id: workspace?.name,
              name: workspace?.name,
              lastUpdate: workspace?.last_updated,
            })
          );
          setWorkspaces(newData);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div>
      <div className={classes.add_dialog}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          New Workspace
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add new Workspace</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Workspace Name"
              value={typedWorkspaceName}
              fullWidth
              onChange={({ target: { value } }) => {
                setTypedWorkspaceName(value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => addWorkspace()} color="primary">
              Add
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className={classes.workspaces__container}>
        <DataGrid
          rows={workspaces}
          columns={columns}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick={true}
          onCellClick={(params, event) => {
            if (params.field === '__check__') return;
            if (params.field === 'z') {
              removeWorkspace(params.row.id);
              return;
            }
            setSelectedWorkspace(params.row.name);
            history.push(`/workspaces/${params.row.name}`);
          }}
        />
      </div>
    </div>
  );
}
