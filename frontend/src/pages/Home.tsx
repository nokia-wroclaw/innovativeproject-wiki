import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({}));

export default function Home() {
  const classes = useStyles();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
