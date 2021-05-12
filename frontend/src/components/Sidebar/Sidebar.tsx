import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListSubheader,
  TextField,
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { getCookie } from '../../contexts/Cookies';
import FileItem from './FileItem';
import useStyles from './Sidebar.styles';
import type { Node } from './Sidebar.types';

const initialList: Node[] = [
  {
    text: 'Item1',
    level: 0,
    open: true,
    children: [
      {
        text: 'Item1.1',
        level: 1,
      },
      {
        text: 'Item1.2',
        level: 1,
        open: false,
        children: [
          {
            text: '1234',
            level: 2,
          },
        ],
      },
      {
        text: 'Item1.3',
        level: 1,
      },
    ],
  },
  {
    text: 'Item2',
    level: 0,
  },
  {
    text: 'Item3',
    level: 0,
    open: true,
    children: [
      {
        text: 'Item3.1',
        level: 1,
      },
    ],
  },
  {
    text: 'Item4',
    level: 0,
  },
];

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [itemList, setItemList] = useState(initialList);
  const [selectedNode, setSelectedNode] = useState<Node>(itemList[0]);
  const { selectedWorkspace } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [typedFileName, setTypedFileName] = useState('');
  const [isFolder, setIsFolder] = useState(false);

  const fetchFiles = useCallback(() => {
    if (selectedWorkspace) {
      console.log('tralalal');
      console.log(selectedWorkspace);
      fetch(`/workspace/translate/${selectedWorkspace}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setItemList(data);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const postItem = async (itemName: string, itemPath: string) => {
    const token = getCookie('token');
    if (token) {
      try {
        await fetch(
          `/workspace/new/${selectedWorkspace}/${itemName}?virtual_path=${itemPath}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => fetchFiles());
      } catch {
        console.error('Error');
      }
    }
  };

  const removeItem = async (itemName: string) => {
    const token = getCookie('token');
    if (token) {
      try {
        //
        await fetch(`/workspace/remove/${selectedWorkspace}/${itemName}`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer '.concat(token),
          },
          body: JSON.stringify({}),
        }).then((res) => {
          //
          fetchFiles();
        });
      } catch {
        console.error('Error');
      }
    }
  };

  const postFolder = async (itemName: string, itemPath: string) => {
    const token = getCookie('token');
    if (token) {
      try {
        await fetch(
          `/workspace/${selectedWorkspace}/new_folder/${itemName}?virtual_path=${itemPath}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => fetchFiles());
      } catch {
        console.error('Error');
      }
    }
  };

  const removeFolder = async (itemName: string) => {
    const token = getCookie('token');
    if (token) {
      try {
        await fetch(
          `/workspace/${selectedWorkspace}/remove_folder/${itemName}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => fetchFiles());
      } catch {
        console.error('Error');
      }
    }
  };

  let path = '';
  const addNode = (item: Node, parentItem: Node, list: Node[]) => {
    const foundItem = list.find((node) => node.text === parentItem.text);

    path += `/${parentItem.text}`;
    if (foundItem) {
      // parentItem.children?.push(item);
      // console.log(path);
      // isFolder ? postFolder(item.text, path) : postItem(item.text, path);
      path = '';
      return;
    }

    list.forEach((node) => {
      if (node.children) addNode(item, parentItem, node.children);
    });
  };

  const removeNode = (item: Node, list: Node[]) => {
    isFolder ? removeFolder(item.text) : removeItem(item.text);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEnterPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (typedFileName) {
        isFolder
          ? postFolder(typedFileName, '/')
          : postItem(typedFileName, '/');
        handleClose();
        setTypedFileName('');
      }
    }
  };

  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            DOCUMENTS
            <IconButton
              color="primary"
              onClick={() => {
                setIsFolder(false);
                handleClickOpen();
              }}
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => {
                setIsFolder(true);
                handleClickOpen();
              }}
            >
              <FolderIcon fontSize="small" />
            </IconButton>
          </ListSubheader>
        }
        className={classes.root}
      >
        {itemList?.map((item) => (
          <FileItem
            key={`${item.text}-${item.level}`}
            item={item}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            itemList={itemList}
            addNode={addNode}
            removeNode={removeNode}
            setItemList={setItemList}
            setIsFolder={setIsFolder}
          />
        ))}
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add new File</DialogTitle>
        <DialogContent>
          <TextField
            onKeyPress={handleEnterPress}
            autoFocus
            margin="dense"
            id="name"
            label="File Name"
            value={typedFileName}
            fullWidth
            onChange={({ target: { value } }) => {
              setTypedFileName(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              isFolder
                ? postFolder(typedFileName, '/')
                : postItem(typedFileName, '/');
              handleClose();
              setTypedFileName('');
            }}
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
  );
};

export default Sidebar;
