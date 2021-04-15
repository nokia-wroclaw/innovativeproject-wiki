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

const initialList = [
  {
    text: 'Report SO2',
  },
  {
    text: 'TODO',
  },
  {
    text: 'GTA codes',
  },
  {
    text: 'bubu',
  },
];

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [itemList, setItemList] = useState(initialList);
  const [typedItem, setTypedItem] = useState('');

  useEffect(() => {
    setSelectedIndex(itemList.length - 1);
  }, [itemList]);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  const addItem = (text: string) => {
    if (!itemList.find((item) => item.text === text)) {
      setItemList([...itemList, { text }]);
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
      <div className={classes.inputContainer}>
        <TextField
          variant="outlined"
          value={typedItem}
          onChange={({ target: { value } }) => {
            setTypedItem(value);
          }}
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => addItem(typedItem)}
        >
          Add
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => removeItem(selectedIndex)}
        >
          Delete
        </Button>
      </div>

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
          <ListItem
            button
            key={`key-${item.text}`}
            selected={selectedIndex === index}
            onClick={(event) => handleListItemClick(event, index)}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {/* <ListItem button onClick={handleClick}>
          <ListItemText primary="GTA codes" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemText primary="Kill all" />
            </ListItem>
          </List>
        </Collapse> */}
      </List>
    </div>
  );
};

export default Sidebar;
