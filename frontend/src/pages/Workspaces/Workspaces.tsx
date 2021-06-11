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
import SettingsIcon from '@material-ui/icons/Settings';
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
    headerName: 'Creation Date', // normally it would be 'last updated' - workaround
    width: 260,
    disableClickEventBubbling: true,
  },
  {
    field: 'settingsField',
    headerName: 'Settings',
    sortable: false,
    width: 150,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <IconButton>
        <SettingsIcon />
      </IconButton>
    ),
  },
  {
    field: 'z',
    headerName: 'Delete',
    sortable: false,
    width: 150,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <IconButton>
        <DeleteIcon />
      </IconButton>
    ),
  },
];

const columnsSettings: GridColDef[] = [
  {
    field: 'ownerField',
    headerName: 'Owner',
    width: 280,
    disableClickEventBubbling: true,
  },
  {
    field: 'deleteField',
    headerName: 'Delete',
    sortable: false,
    width: 150,
    disableClickEventBubbling: true,
    renderCell: (params) => (
      <IconButton>
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export default function DataTable() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);
  const [typedWorkspaceName, setTypedWorkspaceName] = useState('');
  const [workspaceNameErrorMsg, setWorkspaceNameErrorMsg] = useState('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [currentSelectedRow, setCurrentSelectedRow] = useState('');
  // states for workspace settings
  const [openSettings, setOpenSettings] = useState(false);
  const [currentWorkSettings, setCurrentWorkSettings] = useState(''); // name of workspace that has current settings dialog
  const [currentWorkCreator, setCurrentWorkCreator] = useState('');
  const [currentWorkOwners, setCurrentWorkOwners] = useState([
    { id: '', ownerField: '' },
  ]);
  const [ownerToAdd, setOwnerToAdd] = useState('');

  const [workspaces, setWorkspaces] = useState([
    { id: '', name: '', lastUpdate: '' },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenSettings(false);
    setOpenDeleteConfirmation(false);
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
    handleClose();
  };

  const changeWorkspaceSettings = () => {};

  // TODO checkbox private false/true

  const addPostWorkspaces = () => {
    const token = getCookie('token');
    if (token) {
      fetch(
        '/api/workspace/new/'
          .concat(typedWorkspaceName)
          .concat(`?public=false`),
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

  const fetchWorkspaceOwners = (workspace_name: string) => {
    const token = getCookie('token');
    // const currentWS = currentWorkSettings;
    if (token) {
      fetch(`/api/workspace/${workspace_name}/get_contributors`, {
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
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            (owner: any) => ({
              id: owner.username,
              ownerField: owner.username,
              permission: owner.permission_type,
            })
          );

          const newerData = newData.filter(
            (owner: { permission: number; ownerField: string }) => {
              if (owner.permission === 4) {
                setCurrentWorkCreator(owner.ownerField);
                return false;
              }
              return true;
            }
          );

          console.log('New data: ', newerData);
          setCurrentWorkOwners(newerData);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  };

  const addNewOwner = () => {
    const token = getCookie('token');
    if (token) {
      fetch(
        `/api/workspace/${currentWorkSettings}/invite_user?invited_user=${ownerToAdd}`,
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
          console.log(data);
          fetchWorkspaceOwners(currentWorkSettings);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const removeOwner = (owner_name: string) => {
    const token = getCookie('token');
    if (token) {
      fetch(
        `/api/workspace/${currentWorkSettings}/remove_user?removed_user=${owner_name}`,
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
          console.log(data);
          fetchWorkspaceOwners(currentWorkSettings);
        })
        .catch((error) => {
          console.error('Error:', error);
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
              setCurrentSelectedRow(params.row.id);
              setOpenDeleteConfirmation(true);
              return;
            }
            if (params.field === 'settingsField') {
              setCurrentWorkSettings(params.row.id);
              setOpenSettings(true);
              fetchWorkspaceOwners(params.row.id);
              return;
            }
            setSelectedWorkspace(params.row.name);
            history.push(`/workspaces/${params.row.name}`);
          }}
        />
      </div>
{/* Dialog window for deleting workspaces confirmationg */}
      <div className={classes.add_dialog}>
        <Dialog
          open={openDeleteConfirmation}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Deleting Workspace</DialogTitle>
          <DialogContent>
          Are you sure?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => removeWorkspace(currentSelectedRow)} color="primary">
              Delete
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      
      {/* Dialog window for workspace settings */}
      <Dialog
        open={openSettings}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        // className={classes.settingsDialog}
      >
        <DialogTitle id="form-dialog-title">
          Workspace settings - {currentWorkSettings} by {currentWorkCreator}
        </DialogTitle>
        <DialogContent>
          {/* Text field for username of additional owner */}
          <TextField
            // onKeyPress={handleEnterPress}
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            // value={oldPassword}
            fullWidth
            className={classes.settingsWorkspacePopUp}
            onChange={({ target: { value } }) => {
              setOwnerToAdd(value);
            }}
          />
          <div>
            <Button
              color="primary"
              variant="contained"
              className={classes.buttonAddOwner}
              onClick={() => addNewOwner()}
            >
              Add Owner
            </Button>
          </div>

          {/* Table for workspace owners */}
          <div>
            <DataGrid
              rows={currentWorkOwners}
              columns={columnsSettings}
              pageSize={10}
              checkboxSelection
              className={classes.settingsTable}
              disableSelectionOnClick={true}
              onCellClick={(params, event) => {
                if (params.field === '__check__') return;
                if (params.field === 'deleteField') {
                  setOpenDeleteConfirmation(true);
                  removeOwner(params.row.id);
                }
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => changeWorkspaceSettings()} color="primary">
          Confirm
        </Button> */}
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
