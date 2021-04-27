import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import './LastActivity.css'

export default function LastActivity() {
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
            Document 1
          </div>
          <div className="pathToDoc">
            Workspace 1 {'>>'} Catalog 1
          </div>
          <div className="modificationDate">
            25.04.2021
          </div>
        </div>

        <div className="lastDocContainer">
          <div className="docName">
            Document 2
          </div>
          <div className="pathToDoc">
            Workspace 2 
          </div>
          <div className="modificationDate">
            14.04.2021
          </div>
        </div>
          
        <div className="lastDocContainer">
          <div className="docName">
            Document 3
          </div>
          <div className="pathToDoc">
            Workspace 3 {'>>'} Catalog 2
          </div>
          <div className="modificationDate">
            10.04.2021
          </div>
        </div>
      </div>
    </div>
  );
}
