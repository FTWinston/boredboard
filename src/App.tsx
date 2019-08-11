import React from 'react';
import svg from './chessboard.svg';
import './App.css';
import { BoardEditor } from './editor/board';

const App: React.FC = () => {
  return (
    <div className="App">
      <BoardEditor filepath={svg} />
    </div>
  );
}

export default App;
