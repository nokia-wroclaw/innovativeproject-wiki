/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from 'react';
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
import { Link } from 'react-router-dom';
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
  removeNode: (item: Node) => void;
  setItemList: (itemList: Node[]) => void;
  setIsFolder: (isFolder: boolean) => void;
  workspaceName: string;
  index: number;
  fetchFiles: () => void;
  hidden: boolean;
  setHidden?: (hidden: boolean) => void;
  hideItems: (item: Node, list: Node[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fileStructure: any[];
};

const FileItem: React.FC<FileItemProps> = (props) => {
  const classes = useStyles();
  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [addOpen, setAddOpen] = useState(false);
  const [input, setInput] = useState('');
  const [fileNameErrorMsg, setFileNameErrorMsg] = useState('');
  const [open, setOpen] = useState(props.item.open);
  const [pathShown, setPathShown] = useState(false);

  // const { selectedWorkspace, setSelectedWorkspace } = useContext(AppContext);
  const selectedWorkspace = props.workspaceName;

  const handleRightClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    props.setSelectedNode(props.item);

    if (props.item.children) props.setIsFolder(true);
    else props.setIsFolder(false);

    if (state.mouseY == null) {
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    } else handleClose();
  };

  const handleEnterPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      // doc/folder name - data validation
      if (!/^[a-z0-9_-]+$/i.test(input)) {
        setFileNameErrorMsg('Doc/folder name is incorrect'); //  /^[a-z0-9]+$/i
        return;
      }

      // if (props.item.children?.find((list: {text: string} )=> list.text === input)
      //    || props.itemList?.find((list: {text: string }) => list.text === input))
      // {
      //   setFileNameErrorMsg("Doc/folder name must be unique!");
      //   return;
      // }

      if (
        props.fileStructure?.find(
          (file: { name: string }) => file.name === input
        )
      ) {
        setFileNameErrorMsg('Doc/folder name must be unique!');
        return;
      }

      event.preventDefault();
      if (input) {
        const node = {
          text: input,
          level: props.item.level + 1,
        };

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
    props.removeNode(props.item);
    props.setItemList(newItemList);
  };

  let childNodes = null;

  // the Node component calls itself if there are children
  if (props.item.children) {
    childNodes = props.item.children.map((childNode, index) => (
      <FileItem
        key={`${childNode.text}-${childNode.level}`}
        item={childNode}
        selectedNode={props.selectedNode}
        setSelectedNode={props.setSelectedNode}
        itemList={props.itemList}
        addNode={props.addNode}
        removeNode={props.removeNode}
        setItemList={props.setItemList}
        setIsFolder={props.setIsFolder}
        workspaceName={props.workspaceName}
        index={index}
        fetchFiles={props.fetchFiles}
        hidden={props.hidden}
        hideItems={props.hideItems}
        fileStructure={props.fileStructure}
      />
    ));
  }

  const showPath = () => {
    const foundItem = props.fileStructure.find(
      (item) => item.name === props.item.text
    );
    const path = foundItem.virtual_path
      .split('/')
      .filter((item: string) => item !== '');
    path.push(props.item.text);
    const newStructure = path.map((item: string, index: number) => [
      {
        text: item,
        level: index,
        open: true,
      },
    ]);

    for (let i = newStructure.length - 1; i > 0; i--) {
      newStructure[i - 1][0].children = newStructure[i];
    }
    props.setItemList(newStructure[0]);
    setPathShown(true);
  };

  return props.hidden &&
    !open &&
    props.selectedNode?.text !== props.item.text ? null : (
    <div
      style={{ cursor: 'context-menu', paddingLeft: 20 }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {childNodes ? (
        <ListItem
          button
          selected={props.selectedNode?.text === props.item.text}
          onClick={(event) => {
            props.setSelectedNode(props.item);
            console.log(props.item);
            if (props.item.children) props.setIsFolder(true);
            else props.setIsFolder(false);
            if (open) {
              props.fetchFiles();
            }
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
      ) : (
        <Link
          to={`/workspaces/${selectedWorkspace}/${props.item.text}`}
          className={classes.fileItem}
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
        </Link>
      )}
      {addOpen ? (
        <ListItem className={classes.nested}>
          <TextField
            error={!!fileNameErrorMsg}
            onKeyPress={handleEnterPress}
            value={input}
            helperText={fileNameErrorMsg}
            onChange={({ target: { value } }) => {
              // doc/folder name - data validation
              if (value === '') setFileNameErrorMsg('');
              // reset error msg if blank
              else if (!/^[a-z0-9_-]+$/i.test(value))
                setFileNameErrorMsg('Doc/folder name is incorrect');
              //  /^[a-z0-9]+$/i
              else if (
                props.fileStructure?.find(
                  (file: { name: string }) => file.name === value
                )
              )
                setFileNameErrorMsg('Doc/folder name must be unique!');
              else setFileNameErrorMsg('');

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
                props.setIsFolder(false);
              }}
            >
              Add file
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                setAddOpen(true);
                props.setIsFolder(true);
              }}
            >
              Add folder
            </MenuItem>
            <MenuItem
              onClick={() => {
                props.setIsFolder(true);
                handleRemoveNode();
              }}
            >
              Remove folder
            </MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem
              onClick={() => {
                props.setIsFolder(false);
                handleRemoveNode();
              }}
            >
              Remove file
            </MenuItem>
            <MenuItem
              onClick={() => {
                props.setIsFolder(false);
                if (pathShown) {
                  props.fetchFiles();
                  setPathShown(false);
                } else showPath();
                handleClose();
              }}
            >
              {pathShown ? 'Hide path' : 'Show path'}
            </MenuItem>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default FileItem;
