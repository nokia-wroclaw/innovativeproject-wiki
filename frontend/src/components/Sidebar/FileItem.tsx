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
import useStyles from './Sidebar.styles';

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
    index: number,
    item: Node
  ) => void;
  addItem: (text: string, index: number) => void;
  removeItem: (index: number) => void;
  setSelectedIndex: (selectedIndex: number) => void;
  selectedNode: Node | undefined;
  setSelectedNode: (selectedNode: Node) => void;
  itemList: Node[];
  addNode: (item: Node, parentItem: Node, list: Node[]) => void;
};

const FileItem: React.FC<FileItemProps> = (props) => {
  const classes = useStyles();
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
    // props.handleListItemClick(event, props.index, props.item);
    props.setSelectedNode(props.item);
    console.log(props.item);
  };

  const handleEnterPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (input) {
        // props.addItem(input, props.index);
        const node: Node = {
          text: input,
          level: 1,
        };
        console.log(node);
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

  let childNodes = null;

  // the Node component calls itself if there are children
  if (props.item.children) {
    childNodes = props.item.children.map((childNode: Node) => (
      <FileItem
        key={`${childNode.text}-${childNode.level}`}
        item={childNode}
        index={props.index}
        selectedIndex={props.selectedIndex}
        handleListItemClick={props.handleListItemClick}
        addItem={props.addItem}
        removeItem={props.removeItem}
        setSelectedIndex={props.setSelectedIndex}
        selectedNode={props.selectedNode}
        setSelectedNode={props.setSelectedNode}
        itemList={props.itemList}
        addNode={props.addNode}
      />
    ));
  }

  return (
    <div
      onContextMenu={handleRightClick}
      style={{ cursor: 'context-menu', paddingLeft: props.item.level * 20 }}
    >
      <ListItem
        button
        // className={!childNodes ? classes.nested : undefined}
        selected={
          // props.selectedIndex === props.index &&
          // props.selectedNode?.level === props.item.level
          props.selectedNode?.text === props.item.text
        }
        onClick={(event) => {
          props.handleListItemClick(event, props.index, props.item);
          console.log(props.selectedNode);
        }}
      >
        <ListItemIcon>
          {childNodes ? <FolderIcon /> : <DescriptionIcon />}
        </ListItemIcon>
        <ListItemText primary={props.item.text} />
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
        <div>
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {childNodes}
            </List>
          </Collapse>
        </div>
      ) : null}
      {childNodes ? (
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
        </Menu>
      ) : (
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
              props.removeItem(props.index);
            }}
          >
            Remove file
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default FileItem;
