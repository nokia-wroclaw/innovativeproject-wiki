import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import RemoveIcon from '@material-ui/icons/Remove';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import useStyles from './Sidebar.styles';

const Sidebar: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
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
      <ListItem button>
        {/* <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon> */}
        <ListItemText primary="Report SO2" />
      </ListItem>
      <ListItem button>
        {/* <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon> */}
        <ListItemText primary="TODO" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        {/* <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon> */}
        <ListItemText primary="GTA codes" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            {/* <ListItemIcon>
              <RemoveIcon />
            </ListItemIcon> */}
            <ListItemText primary="Kill all" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default Sidebar;
