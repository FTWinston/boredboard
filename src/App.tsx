import React from 'react';
import './App.css';
import { GameEditor } from './editor';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/editor">
            <GameEditor
                name="sample"
                numPlayers={2}
                saveData={game => console.log('saved game data', JSON.stringify(game))}
            />
          </Route>
          <Route>
            To edit a new game definition, <Link to="/editor">click here</Link>.
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
