import React from 'react';
import DataProvider from './contexts/DataProvider';
import logo from './logo.svg';
import './App.css';
import GMap from './GMap';
import Sidebar from './Sidebar';
import * as data from './data.json';

function App() {
  
  return (
    <div className="App">
      <div className="App-content">
        <DataProvider>
          <GMap />
          <Sidebar />
        </DataProvider>
        
      </div>
    </div>
  );
}

export default App;
