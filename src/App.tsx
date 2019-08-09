import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BoardDisplay } from './editor/board/BoardDisplay';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <BoardDisplay filepath={logo} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
