import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';
import { getCookie } from '../../contexts/Cookies';
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
  const [workspaceNameErrorMsg, setWorkspaceNameErrorMsg] = useState('');

  const [workspaces, setWorkspaces] = useState([
    { id: '', name: '', lastUpdate: '' },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    textFieldClear();
    setWorkspaceNameErrorMsg('');
  };

  const textFieldClear = () => {
    setTypedWorkspaceName('');
  };

  const removeWorkspace = (id: string) => {
    const found = workspaces.find((workspace) => workspace.id === id);
    const token = getCookie('token');
    if (token && found) {
      fetch(`/api/workspace/remove/${found.name}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer '.concat(token),
          // 'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          fetchWorkspaces();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  // TODO checkbox private false/true

  const addPostWorkspaces = () => {
    const token = getCookie('token');
    if (token) {
      fetch(
        '/api/workspace/new/'.concat(typedWorkspaceName).concat(`?private=false`),
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
          fetchWorkspaces();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const handleEnterPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      if (!/^[a-z0-9_-]+$/i.test(typedWorkspaceName)) {
        setWorkspaceNameErrorMsg('Workspace name is incorrect!');
        return;
      }

      if (
        workspaces.find((workspace) => workspace.name === typedWorkspaceName)
      ) {
        setWorkspaceNameErrorMsg('Workspace name must be unique!');
        return;
      }

      event.preventDefault();

      if (
        !workspaces.find(
          (workspace) => workspace.name === typedWorkspaceName
        ) &&
        typedWorkspaceName
      ) {
        addPostWorkspaces();
        handleClose();
      }
    }
  };

  const addWorkspace = () => {
    if (!/^[a-z0-9_-]+$/i.test(typedWorkspaceName)) {
      setWorkspaceNameErrorMsg('Workspace name is incorrect!');
      return;
    }

    if (workspaces.find((workspace) => workspace.name === typedWorkspaceName)) {
      setWorkspaceNameErrorMsg('Workspace name must be unique!');
      return;
    }

    if (
      !workspaces.find((workspace) => workspace.name === typedWorkspaceName) &&
      typedWorkspaceName
    ) {
      addPostWorkspaces();
      handleClose();
    }
  };

  const fetchWorkspaces = () => {
    const token = getCookie('token');
    if (token) {
      fetch('/api/user/active_workspaces', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer '.concat(token),
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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
              error={!!workspaceNameErrorMsg}
              helperText={workspaceNameErrorMsg}
              onKeyPress={handleEnterPress}
              autoFocus
              margin="dense"
              id="name"
              label="Workspace Name"
              value={typedWorkspaceName}
              className={classes.addWorkspacePopUp}
              fullWidth
              onChange={({ target: { value } }) => {
                if (value === '') setWorkspaceNameErrorMsg('');
                else if (!/^[a-z0-9_-]+$/i.test(value))
                  setWorkspaceNameErrorMsg('Workspace name is incorrect!');
                else if (
                  workspaces.find((workspace) => workspace.name === value)
                )
                  setWorkspaceNameErrorMsg('Workspace name must be unique!');
                else setWorkspaceNameErrorMsg('');

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
