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
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [itemList, setItemList] = useState(initialList);
  const [typedItem, setTypedItem] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node>();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    item: Node
  ) => {
    setSelectedIndex(index);
    setSelectedNode(item);
  };

  const addItem = (text: string, index: number) => {
    if (!itemList.find((item) => item.text === text)) {
      const tempList = [...itemList];
      const newItem: Node = { text, level: 1 };
      tempList.splice(index + 1, 0, newItem);
      setItemList(tempList);
      setSelectedIndex(index + 1);
    }
    // eslint-disable-next-line no-alert
    else window.alert('This file already exists');
    setTypedItem('');
  };

  const removeItem = (index: number) => {
    const list = [...itemList];
    list.splice(index, 1);
    setItemList(list);
  };

  const addNode = (item: Node, parentItem: Node, list: Node[]) => {
    const foundItem = list.find((node) => node.text === parentItem.text);

    if (foundItem) {
      parentItem.children?.push(item);
    }

    list.forEach((node) => {
      if (node.children) addNode(item, parentItem, node.children);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function containsInNestedObjectDF(obj: any, val: any) {
    if (obj === val) {
      return true;
    }

    const keys = obj instanceof Object ? Object.keys(obj) : [];

    for (const key of keys) {
      const objval = obj[key];

      const isMatch = containsInNestedObjectDF(objval, val);

      if (isMatch) {
        return true;
      }
    }

    return false;
  }

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          const hasIt = containsInNestedObjectDF(itemList, 'dfg'); // true
          console.log(hasIt);
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
            index={index}
            selectedIndex={selectedIndex}
            handleListItemClick={handleListItemClick}
            addItem={addItem}
            removeItem={removeItem}
            setSelectedIndex={setSelectedIndex}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            itemList={itemList}
            addNode={addNode}
          />
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
