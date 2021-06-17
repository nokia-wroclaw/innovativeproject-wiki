/* eslint-disable import/no-named-as-default */
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
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
  Typography,
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppContext } from '../../contexts/AppContext';
import { getCookie } from '../../contexts/Cookies';
import FileItem from './FileItem';
import useStyles from './Sidebar.styles';
import type { Node } from './Sidebar.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Sidebar = (props: any) => {
  const classes = useStyles();
  const [itemList, setItemList] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node>(itemList[0]);
  // const { selectedWorkspace } = useContext(AppContext);
  const selectedWorkspace = props.workspaceName;
  const [open, setOpen] = useState(false);
  const [typedFileName, setTypedFileName] = useState('');
  const [fileNameErrorMsg, setFileNameErrorMsg] = useState('');
  const [isFolder, setIsFolder] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fileStructure, setFileStructure] = useState<any>([]);

  const [hidden, setHidden] = useState(false);

  const fetchFiles = useCallback(() => {
    if (selectedWorkspace) {
      fetch(`/api/workspace/tree_structure/${selectedWorkspace}`, {
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

  const fetchFileStructure = useCallback(() => {
    if (selectedWorkspace) {
      fetch(`/api/workspace/raw_structure/${selectedWorkspace}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFileStructure(data);
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    fetchFiles();
    fetchFileStructure();
  }, [fetchFiles, fetchFileStructure]);

  const postItem = async (itemName: string, itemPath: string) => {
    const token = getCookie('token');
    if (token) {
      try {
        await fetch(
          `/api/workspace/${selectedWorkspace}/new_document/${itemName}?virtual_path=${itemPath}`,

          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => {
          fetchFiles();
          fetchFileStructure();
        });
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
        await fetch(
          `/api/workspace/${selectedWorkspace}/remove_document/${itemName}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => {
          fetchFiles();
          fetchFileStructure();
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
          `/api/workspace/${selectedWorkspace}/new_folder/${itemName}?virtual_path=${itemPath}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => {
          fetchFiles();
          fetchFileStructure();
        });
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
          `/api/workspace/${selectedWorkspace}/remove_folder/${itemName}`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer '.concat(token),
            },
            body: JSON.stringify({}),
          }
        ).then(() => {
          fetchFiles();
          fetchFileStructure();
        });
      } catch {
        console.error('Error');
      }
    }
  };

  const addNode = (item: Node, parentItem: Node, list: Node[]) => {
    const path = fileStructure?.find(
      (file: { name: string }) => file.name === parentItem.text
    ).virtual_path;
    const fullPath =
      path === '/' ? `${path}${parentItem.text}` : `${path}/${parentItem.text}`;
    // console.log(fullPath);

    isFolder ? postFolder(item.text, fullPath) : postItem(item.text, fullPath);
  };

  const removeNode = (item: Node) => {
    console.log(item);
    isFolder ? removeFolder(item.text) : removeItem(item.text); // !
    console.log(isFolder);
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
      // doc/folder name - data validation
      if (!/^[a-z0-9_-]+$/i.test(typedFileName)) {
        setFileNameErrorMsg('Doc/folder name is incorrect'); //  /^[a-z0-9]+$/i
        return;
      }

      if (
        fileStructure?.find(
          (file: { name: string }) => file.name === typedFileName
        )
      ) {
        setFileNameErrorMsg('Doc/folder name must be unique!');
        return;
      }

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
  const hideItems = (item: Node, list: Node[]) => {
    // const found = list.find((node) => node.text === item.text);
    // if (found) {
    //   console.log('FOUND!!!!!!!!!!');
    //   return;
    // }
    // list.forEach((node) => {
    //   // console.log(node.text);
    //   // setHidden blablaba
    //   if (node.children) hideItems(item, node.children);
    // });
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              disableSticky={true}
              className={classes.listName}
            >
              <IconButton to="/workspaces" component={Link}>
                <ArrowBackOutlinedIcon fontSize="small" />
              </IconButton>

              <Typography variant="h6">{selectedWorkspace}</Typography>
              <div>
                <IconButton
                  onClick={() => {
                    setIsFolder(false);
                    handleClickOpen();
                  }}
                >
                  <DescriptionIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsFolder(true);
                    handleClickOpen();
                  }}
                >
                  <FolderIcon fontSize="small" />
                </IconButton>
                {/* <ToggleButton
                  className={classes.toggleButton}
                  value="check"
                  selected={hidden}
                  onChange={() => {
                    setHidden(!hidden);
                  }}
                >
                  <ClearAllIcon />
                </ToggleButton> */}
              </div>
            </ListSubheader>
          }
          className={classes.root}
        >
          {itemList?.map((item, index) => (
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
              workspaceName={selectedWorkspace}
              index={index}
              fetchFiles={fetchFiles}
              hidden={hidden}
              hideItems={hideItems}
              fileStructure={fileStructure}
            />
          ))}
        </List>
      </DndProvider>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {isFolder ? 'Add new folder' : 'Add new file'}
        </DialogTitle>
        <DialogContent>
          <TextField
            error={!!fileNameErrorMsg}
            onKeyPress={handleEnterPress}
            autoFocus
            margin="dense"
            id="name"
            label={isFolder ? 'Folder name' : 'File name'}
            // value={typedFileName}
            helperText={fileNameErrorMsg}
            className={classes.addDocFolderPopUp}
            fullWidth
            onChange={({ target: { value } }) => {
              // doc/folder name - data validation
              if (value === '') setFileNameErrorMsg('');
              // reset error msg if blank
              else if (!/^[a-z0-9_-]+$/i.test(value))
                setFileNameErrorMsg('Doc/folder name is incorrect');
              //  /^[a-z0-9]+$/i
              else if (
                fileStructure?.find(
                  (file: { name: string }) => file.name === value
                )
              )
                setFileNameErrorMsg('Doc/folder name must be unique!');
              else setFileNameErrorMsg('');

              setTypedFileName(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // validation before fetch
              if (!typedFileName || fileNameErrorMsg) return;

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
          <Button
            onClick={() => {
              setFileNameErrorMsg('');
              handleClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
