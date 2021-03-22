import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <Link to="/About">Go to About</Link>
    </div>
  );
}
