import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import DescriptionIcon from '@material-ui/icons/Description';

const initialState = {
  mouseX: null,
  mouseY: null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FileItem(props: any) {
  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [addOpen, setAddOpen] = useState(false);
  const [input, setInput] = useState('');

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (state.mouseY == null) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    } else handleClose();
    props.setSelectedIndex(props.index);
  };

  const handleClose = () => {
    setState(initialState);
    setAddOpen(false);
  };

  return (
    <div onContextMenu={handleRightClick} style={{ cursor: 'context-menu' }}>
      <ListItem
        button
        selected={props.selectedIndex === props.index}
        onClick={(event) => props.handleListItemClick(event, props.index)}
      >
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={props.item.text} />
      </ListItem>
      {addOpen ? (
        <ListItem>
          <TextField
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                props.addItem(input, props.index);
                setAddOpen(false);
                setInput('');
              }
            }}
            value={input}
            onChange={({ target: { value } }) => {
              setInput(value);
            }}
          />
        </ListItem>
      ) : null}

      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setAddOpen(true);
          }}
        >
          Add file
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            props.removeItem(props.index);
          }}
        >
          Remove file
        </MenuItem>
      </Menu>
    </div>
  );
}
