import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IBoardDefinition } from '../../data/IBoardDefinition';
import { IPieceDefinition } from '../../data/IPieceDefinition';
import './EditorSummary.css';
import { EditorItemList } from './components/EditorItemList';
import { INamed } from '../gameReducer';


interface Props extends RouteComponentProps<{}> {
    name: string;
    boards: Array<IBoardDefinition & INamed>;
    pieces: Array<IPieceDefinition & INamed>;
    rules: string;
}

const EditorSummary: FunctionComponent<Props> = props => {
    console.log(props.pieces)
    return (
        <div className="editorSummary">
            <h2 className="editorSummary__title">Editing game: {props.name}</h2>

            <EditorItemList
                itemType="board"
                items={props.boards}
                rootUrl={props.match.url}
            />

            <EditorItemList
                itemType="piece"
                items={props.pieces}
                rootUrl={props.match.url}
            />

            
            <div className="editorItemList">
                <h3 className="editorItemList__title">Rules</h3>
                You haven't entered any rules.
            </div>
        </div>
    );
}

export default withRouter(EditorSummary);