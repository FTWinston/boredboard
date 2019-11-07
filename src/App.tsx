import React from 'react';
import './App.css';
import { GameEditor } from './editor';
import { BrowserRouter as Router } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <GameEditor
            name="sample"
            numPlayers={2}
            saveData={game => console.log('saved game data', JSON.stringify(game))}
        />
      </div>
    </Router>
  );
}

export default App;
