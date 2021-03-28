import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import TextEditor from '../components/TextEditor';

export default function Home() {
  return (
    <div>
      <Link to="/about">Go to About</Link>
      <TextEditor />
    </div>
  );
}
