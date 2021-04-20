import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import DescriptionIcon from '@material-ui/icons/Description';

const initialState = {
  mouseX: null,
  mouseY: null,
};

type Node = {
  text: string;
  level: number;
  children?: Node[];
};

type FileItemProps = {
  item: Node;
  index: number;
  selectedIndex: number;
  handleListItemClick: (
    event: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => void;
  addItem: (text: string, index: number) => void;
  removeItem: (index: number) => void;
  setSelectedIndex: (selectedIndex: number) => void;
};

const FileItem: React.FC<FileItemProps> = (props) => {
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

  let childNodes = null;

  // the Node component calls itself if there are children
  if (props.item.children) {
    childNodes = props.item.children.map((childNode: Node) => (
      <FileItem
        key={`${props.item.text}-${props.item.level}`}
        item={childNode}
        index={props.index}
        selectedIndex={props.selectedIndex}
        handleListItemClick={props.handleListItemClick}
        addItem={props.addItem}
        removeItem={props.removeItem}
        setSelectedIndex={props.setSelectedIndex}
      />
    ));
  }

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
                if (input) props.addItem(input, props.index);
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
      {childNodes ? <ul>{childNodes}</ul> : null}
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
};

export default FileItem;
