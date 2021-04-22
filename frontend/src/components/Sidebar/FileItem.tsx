import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FolderIcon from '@material-ui/icons/Folder';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import DescriptionIcon from '@material-ui/icons/Description';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import useStyles from './Sidebar.styles';
import type { Node } from './Sidebar.types';

const initialState = {
  mouseX: null,
  mouseY: null,
};

type FileItemProps = {
  item: Node;
  selectedNode: Node;
  setSelectedNode: (selectedNode: Node) => void;
  itemList: Node[];
  addNode: (item: Node, parentItem: Node, list: Node[]) => void;
  removeNode: (item: Node, list: Node[]) => void;
  setItemList: (itemList: Node[]) => void;
};

const FileItem: React.FC<FileItemProps> = (props) => {
  const classes = useStyles();
  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [addOpen, setAddOpen] = useState(false);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(props.item.open);
  const [isAddFolder, setIsAddFolder] = useState(false);

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (state.mouseY == null) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    } else handleClose();
    props.setSelectedNode(props.item);
  };

  const handleEnterPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (input) {
        let node: Node;
        if (isAddFolder) {
          node = {
            text: input,
            level: props.item.level + 1,
            children: [],
          };
        } else {
          node = {
            text: input,
            level: props.item.level + 1,
          };
        }
        props.addNode(node, props.item, props.itemList);
      }
      setAddOpen(false);
      setInput('');
    }
  };

  const handleClose = () => {
    setState(initialState);
    setAddOpen(false);
  };

  const handleRemoveNode = () => {
    handleClose();
    const newItemList = JSON.parse(JSON.stringify(props.itemList));
    props.removeNode(props.item, newItemList);
    props.setItemList(newItemList);
  };

  let childNodes = null;

  // the Node component calls itself if there are children
  if (props.item.children) {
    childNodes = props.item.children.map((childNode: Node) => (
      <FileItem
        key={`${childNode.text}-${childNode.level}`}
        item={childNode}
        selectedNode={props.selectedNode}
        setSelectedNode={props.setSelectedNode}
        itemList={props.itemList}
        addNode={props.addNode}
        removeNode={props.removeNode}
        setItemList={props.setItemList}
      />
    ));
  }

  return (
    <div
      style={{ cursor: 'context-menu', paddingLeft: 20 }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <ListItem
        button
        selected={props.selectedNode?.text === props.item.text}
        onClick={(event) => {
          props.setSelectedNode(props.item);
          setOpen(!open);
        }}
        onContextMenu={handleRightClick}
      >
        <ListItemIcon>
          {childNodes ? <FolderIcon /> : <DescriptionIcon />}
        </ListItemIcon>
        <ListItemText primary={props.item.text} />
        {props.item.children && open && <ExpandLess />}
        {props.item.children && !open && <ExpandMore />}
      </ListItem>
      {addOpen ? (
        <ListItem className={classes.nested}>
          <TextField
            onKeyPress={handleEnterPress}
            value={input}
            onChange={({ target: { value } }) => {
              setInput(value);
            }}
          />
        </ListItem>
      ) : null}
      {childNodes ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {childNodes}
          </List>
        </Collapse>
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
        {childNodes ? (
          <div>
            <MenuItem
              onClick={() => {
                handleClose();
                setAddOpen(true);
                setIsAddFolder(false);
              }}
            >
              Add file
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                setAddOpen(true);
                setIsAddFolder(true);
              }}
            >
              Add folder
            </MenuItem>
            <MenuItem onClick={handleRemoveNode}>Remove folder</MenuItem>
          </div>
        ) : (
          <MenuItem onClick={handleRemoveNode}>Remove file</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default FileItem;
