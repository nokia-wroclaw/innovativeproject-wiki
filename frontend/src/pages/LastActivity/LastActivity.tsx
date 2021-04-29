import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import './LastActivity.css'

export default function LastActivity() {

  const [lastDocs, setLastDocs] = useState([
    {"name": "Document 1", "path": "Workspace 1 >> Catalog 1", "modificationDate": "25.04.2021"},
    {"name": "Document 2", "path": "Workspace 2", "modificationDate": "14.04.2021"},
    {"name": "Document 3", "path": "Workspace 3 >> Catalog 2", "modificationDate": "10.04.2021"}
  ])

  return (
    <div>
      <div id="greetings">Hello <span id="userName">Filip</span>!</div>
      <div id="activitiesContainerTitle">Your last activity:</div>
      <div id="activitiesContainer" className="shadow1">

        <div id="headerContainer">
          <div id="docNameHeader">
            Name
          </div>
          <div id="pathToDocHeader">
            Path
          </div>
          <div id="modificationDateHeader">
            Modification date
          </div>
        </div>

        <div className="lastDocContainer">
          <div className="docName">
            {lastDocs[0].name}
          </div>
          <div className="pathToDoc">
            {lastDocs[0].path}
          </div>
          <div className="modificationDate">
            {lastDocs[0].modificationDate}
          </div>
        </div>

        <div className="lastDocContainer">
          <div className="docName">
            {lastDocs[1].name}
          </div>
          <div className="pathToDoc">
            {lastDocs[1].path}
          </div>
          <div className="modificationDate">
            {lastDocs[1].modificationDate}
          </div>
        </div>
          
        <div className="lastDocContainer">
          <div className="docName">
            {lastDocs[2].name}
          </div>
          <div className="pathToDoc">
            {lastDocs[2].path}
          </div>
          <div className="modificationDate">
            {lastDocs[2].modificationDate}
          </div>
        </div>
      </div>
    </div>
  );
}
