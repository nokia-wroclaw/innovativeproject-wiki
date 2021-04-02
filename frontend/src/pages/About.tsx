import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

export default function About() {
  return (
    <div>
      <Button color="primary" to="/" component={Link}>
        Go to Home
      </Button>
    </div>
  );
}
