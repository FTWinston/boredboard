import React from 'react';
import './App.css';
import { BoardEditor } from './editor/board';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <BoardEditor name="sample" saveData={board => {}} />
      </div>
    </Router>
  );
}

export default App;
