import React, { useState } from 'react';
import './BoardEditor.css';
import { EditableBoard } from './EditableBoard';

interface Props {
    filepath: string;
}

export type Mode = 'check cells' | 'auto link' | 'manual link';

export const BoardEditor: React.FunctionComponent<Props> = props => {
    const [ mode, setMode ] = useState('check cells' as Mode);

    return (
        <div className="boardEditor">
            <EditableBoard
                filepath={props.filepath}
                mode={mode}
            />

            <div className="boardEditor__buttons">
                <button onClick={() => setMode('check cells')} disabled={mode === 'check cells'}>check cells</button>

                <button onClick={() => setMode('auto link')}>auto link</button>

                <button onClick={() => setMode('manual link')}>manual link</button>
            </div>
        </div>
    );
}