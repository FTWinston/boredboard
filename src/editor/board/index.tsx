import React, { useState } from 'react';
import './BoardDisplay.css';
import { EditableBoard } from './EditableBoard';

interface Props {
    filepath: string;
}

export type Mode = 'mark cells' | 'unmark cells' | 'create cells' | 'auto link' | 'manual link';

export const BoardEditor: React.FunctionComponent<Props> = props => {
    const [ mode, setMode ] = useState('mark cells' as Mode);

    return (
        <div className="boardEditor">
            <EditableBoard
                filepath={props.filepath}
                mode={mode}
            />

            <div className="boardEditor__buttons">
                <button onClick={() => setMode('mark cells')} disabled={mode === 'mark cells'}>mark cells</button>

                <button onClick={() => setMode('unmark cells')} disabled={mode === 'unmark cells'}>unmark cells</button>

                <button onClick={() => setMode('create cells')}>create cells</button>

                <button onClick={() => setMode('auto link')}>auto link</button>

                <button onClick={() => setMode('manual link')}>manual link</button>
            </div>
        </div>
    );
}