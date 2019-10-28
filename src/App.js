import React from 'react';
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

  console.log("fgooooooo");
}

function setCoords(acoords) {
  coords = acoords;
  return coords;
}

function newRestaurant(coords) {
  return 
}

function App() {
  
  return (
    <div className="App">
      <div className="App-content">
        <GMap coords={setCoords} update={update} db={db} />
        <Sidebar key={332} coords={coords} updateMap={update} db={window.db} />
      </div>
    </div>
  );
}

export default App;
