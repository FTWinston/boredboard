import React, { FunctionComponent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IBoardDefinition } from '../../data/IBoardDefinition';
import { IPieceDefinition } from '../../data/IPieceDefinition';
import { Dictionary } from '../../data/Dictionary';
import './EditorSummary.css';
import { EditorItemList } from './components/EditorItemList';


interface Props extends RouteComponentProps<{}> {
    name: string;
    boards: Dictionary<string, IBoardDefinition>;
    pieces: Dictionary<string, IPieceDefinition>;
    rules: string;
}

const EditorSummary: FunctionComponent<Props> = props => {
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
        </div>
    );
}

export default withRouter(EditorSummary);