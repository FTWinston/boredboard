import React, { useMemo } from 'react';
import './App.css';
import { GameEditor } from './editor';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { Game } from './player/Game';
import { getGame, listGames } from './getGame';

const App: React.FC = () => {
    const games = useMemo(() => listGames(), []);

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/edit/new">
                        <GameEditor
                            name="sample"
                            numPlayers={2}
                            saveData={game => console.log('saved game data', JSON.stringify(game))}
                        />
                    </Route>
                    <Route path="/edit/:id" render={props => {
                        const gameID: string = props.match.params.id;
                        const [definition] = getGame(gameID);

                        if (definition === undefined) {
                            return <Redirect to="/" />
                        }

                        return (
                          <GameEditor
                              initialData={definition}
                              name={gameID}
                              numPlayers={2}
                              saveData={game => console.log('saved game data', JSON.stringify(game))}
                          />
                        )
                      }}
                    />
                    <Route path="/play/:id" render={props => {
                        const gameID: string = props.match.params.id;
                        const [definition, state] = getGame(gameID);

                        if (definition === undefined) {
                            return <Redirect to="/" />
                        }

                        return <Game
                            definition={definition}
                            initialState={state!}
                        />
                      }}
                    />
                    <Route path="/" exact>
                        <ul>
                            {games.map(g => (
                                <li key={g}>
                                    <strong>{g}</strong>:&nbsp;
                                    <Link to={`/play/${g}`}>play</Link>,&nbsp;
                                    <Link to={`/edit/${g}`}>edit</Link>
                                </li>
                            ))}
                        </ul>
                        <p>To create a new game definition, <Link to="/edit/new">click here</Link>.</p>
                    </Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
