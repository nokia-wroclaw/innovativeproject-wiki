import React, { useState } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import useStyles from './Sidebar.styles';
import FileItem from './FileItem';
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
            text: 'Item1.2.1',
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

  const postItem = async (itemPath: string) => {
    try {
      const workspaceName = 'nalesniki';
      console.log(itemPath);
      await fetch(`/workspace/new/${workspaceName}/${itemPath}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }).then((res) => console.log(res));
    } catch {
      console.error('Error');
    }
  };

  let path = '';
  const addNode = (item: Node, parentItem: Node, list: Node[]) => {
    const foundItem = list.find((node) => node.text === parentItem.text);
    path += `${parentItem.text}#`;
    if (foundItem) {
      path += `${item.text}`;
      parentItem.children?.push(item);
      postItem(path);
      path = '';
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
      return;
    }

    list.forEach((node) => {
      if (node.children) removeNode(item, node.children);
    });
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
      {itemList.map((item) => (
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
  );
};

export default Sidebar;
