import React from 'react';
import './App.css';
import { GameEditor } from './editor';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { GameBoard } from './player/GameBoard';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/edit">
            <GameEditor
                name="sample"
                numPlayers={2}
                saveData={game => console.log('saved game data', JSON.stringify(game))}
            />
          </Route>
          <Route path="/play">
            <GameBoard />
          </Route>
          <Route>
            <p>To edit a new game definition, <Link to="/edit">click here</Link>.</p>
            <p>To view an existing game, <Link to="/play">click here</Link>.</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
