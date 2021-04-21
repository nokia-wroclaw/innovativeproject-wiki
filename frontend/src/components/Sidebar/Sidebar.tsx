import React, { useState, useEffect } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import useStyles from './Sidebar.styles';
import FileItem from './FileItem';

type Node = {
  text: string;
  level: number;
  children?: Node[];
};

const initialList: Node[] = [
  {
    text: 'Item 1',
    level: 0,
    children: [
      {
        text: 'Item 1.1',
        level: 1,
      },
      {
        text: 'Item 1.2',
        level: 1,
        children: [
          {
            text: 'Item 1.2.1',
            level: 2,
          },
        ],
      },
      {
        text: 'Item 1.3',
        level: 1,
      },
    ],
  },
  {
    text: 'Item 2',
    level: 0,
  },
  {
    text: 'Item 3',
    level: 0,
    children: [
      {
        text: 'Item 3.1',
        level: 1,
      },
    ],
  },
  {
    text: 'Item 4',
    level: 0,
  },
];

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [itemList, setItemList] = useState(initialList);
  const [typedItem, setTypedItem] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node>(itemList[0]);

  const addNode = (item: Node, parentItem: Node, list: Node[]) => {
    const foundItem = list.find((node) => node.text === parentItem.text);

    if (foundItem) {
      console.log('added');
      parentItem.children?.push(item);
      return;
    }

    list.forEach((node) => {
      if (node.children) addNode(item, parentItem, node.children);
    });
  };

  const removeNode = (item: Node, list: Node[]) => {
    const foundIndex = list.findIndex((node) => node.text === item.text);

    if (foundIndex >= 0) {
      list.splice(foundIndex, 1);
      // setSelectedNode(selectedNode);
      return;
    }

    list.forEach((node) => {
      if (node.children) removeNode(item, node.children);
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          console.log(itemList);
        }}
      >
        Click me
      </Button>{' '}
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            DOCUMENTS
          </ListSubheader>
        }
        className={classes.root}
      >
        {itemList.map((item, index) => (
          <FileItem
            key={`${item.text}-${item.level}`}
            item={item}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            itemList={itemList}
            addNode={addNode}
            removeNode={removeNode}
          />
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
