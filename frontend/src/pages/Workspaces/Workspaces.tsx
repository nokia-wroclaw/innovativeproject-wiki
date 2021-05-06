import React, { useState, useContext } from 'react';
import { DataGrid, GridColDef, nextGridSortDirection } from '@material-ui/data-grid';
import { IconButton, Button, Dialog, DialogTitle, TextField, DialogContent, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
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
  const [ typedWorkspaceName, setTypedWorkspaceName ] = useState("");
  const [workspaces, setWorkspaces] = useState([
    { id: 'Workspace_1', name: 'Workspace_1', lastUpdate: '25.04.2021' },
    { id: 'Workspace_2', name: 'Workspace_2', lastUpdate: '14.04.2021' },
    { id: 'Workspace_3', name: 'Workspace_3', lastUpdate: '10.04.2021' },
    { id: 'Workspace_4', name: 'Workspace_4', lastUpdate: '05.04.2021' },
    { id: 'Workspace_5', name: 'Workspace_5', lastUpdate: '27.03.2021' },
    { id: 'Workspace_6', name: 'Workspace_6', lastUpdate: '26.03.2021' },
  ]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeWorkspace = (id: string) => {
    const foundIndex = workspaces.findIndex((workspace) => workspace.id === id);
    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces.splice(foundIndex, 1);
    setWorkspaces(updatedWorkspaces);
  };

  const addWorkspace = () => {
    const wName = typedWorkspaceName;
    { !(wName in workspaces) ?
    (setWorkspaces([...workspaces, {id: wName, name: wName, lastUpdate: "hehe"}])) : 
    (setWorkspaces([...workspaces, {id: "heeh", name: "heeh", lastUpdate: "hehe"}]))}
  }

  return (

    <div>
      <div className={classes.add_dialog}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          New Workspace
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
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
            <Button 
            onClick={() => addWorkspace()}
            color="primary"
            >
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
