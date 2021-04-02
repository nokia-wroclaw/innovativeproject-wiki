import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor';
import TextEditor2 from '../components/TextEditor2';

export default function Home() {
  return (
    <div>
      <Button color="primary" to="/about" component={Link}>
        Go to About
      </Button>
      {/* <TextEditor /> */}
      <TextEditor2 />
    </div>
  );
}
