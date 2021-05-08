import React, { useState, useContext, useEffect } from 'react';
import {
  List,
  ListSubheader,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import useStyles from './Sidebar.styles';
import FileItem from './FileItem';
import { AppContext } from '../../contexts/AppContext';
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
  const { selectedWorkspace, token } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [typedFileName, setTypedFileName] = useState('');

  const fetchFiles = () => {
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
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const postItem = async (itemName: string, itemPath: string) => {
    if (token) {
      try {
        // console.log(
        //   `/workspace/new/${selectedWorkspace}/${itemName}?virtual_path=${itemPath}`
        // );
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
    if (token) {
      try {
        // console.log(`/workspace/remove/${selectedWorkspace}/${itemName}`);
        await fetch(`/workspace/remove/${selectedWorkspace}/${itemName}`, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer '.concat(token),
          },
          body: JSON.stringify({}),
        }).then((res) => {
          // console.log(res);
          fetchFiles();
        });
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
      parentItem.children?.push(item);
      postItem(item.text, path);
      path = '';
      return;
    }

    list.forEach((node) => {
      if (node.children) addNode(item, parentItem, node.children);
    });
  };

  const removeNode = (item: Node, list: Node[]) => {
    // const foundIndex = list.findIndex((node) => node.text === item.text);

    // if (foundIndex >= 0) {
    //   list.splice(foundIndex, 1);
    //   return;
    // }

    // list.forEach((node) => {
    //   if (node.children) removeNode(item, node.children);
    // });

    removeItem(item.text);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            DOCUMENTS
            <IconButton color="primary" onClick={handleClickOpen}>
              <DescriptionIcon fontSize="small" />
            </IconButton>
            <IconButton color="primary" onClick={handleClickOpen}>
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
              postItem(typedFileName, '/');
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
