import React from 'react';
import DataProvider from './contexts/DataProvider';
import logo from './logo.svg';
import './App.css';
import GMap from './GMap';
import Sidebar from './Sidebar';
import * as data from './data.json';
window.db = data.default;

let db = [...window.db];
let coords = null;

function update() {
  db = [...window.db];
}


function App() {
  
  return (
    <div className="App">
      <div className="App-content">
        <DataProvider>
          <GMap update={update} db={db} />
          <Sidebar updateMap={update} db={window.db} />
        </DataProvider>
        
      </div>
    </div>
  );
}

export default App;
