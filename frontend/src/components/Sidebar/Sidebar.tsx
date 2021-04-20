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
    text: 'Rport SO2',
    level: 0,
    children: [
      {
        text: 'Zad 1',
        level: 1,
      },
      {
        text: 'Zad 2',
        level: 1,
        children: [
          {
            text: 'IDK',
            level: 2,
          },
        ],
      },
    ],
  },
  {
    text: 'TODO',
    level: 0,
  },
  {
    text: 'GTA codes',
    level: 0,
  },
  {
    text: 'bubu',
    level: 0,
  },
];

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [itemList, setItemList] = useState(initialList);
  const [typedItem, setTypedItem] = useState('');

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
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

  return (
    <div>
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
          />
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
