import React, { useState, useContext } from 'react';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { IconButton } from '@material-ui/core';
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
  const classes = useStyles();
  const history = useHistory();
  const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);

  const [workspaces, setWorkspaces] = useState([
    { id: 'Workspace_1', name: 'Workspace_1', lastUpdate: '25.04.2021' },
    { id: 'Workspace_2', name: 'Workspace_2', lastUpdate: '14.04.2021' },
    { id: 'Workspace_3', name: 'Workspace_3', lastUpdate: '10.04.2021' },
    { id: 'Workspace_4', name: 'Workspace_4', lastUpdate: '05.04.2021' },
    { id: 'Workspace_5', name: 'Workspace_5', lastUpdate: '27.03.2021' },
    { id: 'Workspace_6', name: 'Workspace_6', lastUpdate: '26.03.2021' },
    { id: '123', name: '123', lastUpdate: '26.03.2021' },
  ]);

  const removeWorkspace = (id: string) => {
    const foundIndex = workspaces.findIndex((workspace) => workspace.id === id);
    const updatedWorkspaces = [...workspaces];
    updatedWorkspaces.splice(foundIndex, 1);
    setWorkspaces(updatedWorkspaces);
  };

  return (
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
  );
}
