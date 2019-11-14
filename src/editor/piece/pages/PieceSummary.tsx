import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import './PieceSummary.css';
import { Dictionary } from '../../../data/Dictionary';

interface Props extends RouteComponentProps {
    images: Dictionary<number, string>
    behaviour: string;
    saveData: () => void;
}

const PieceSummary: React.FunctionComponent<Props> = props => {
    return (
        <div className="pieceEditor pieceSummary">
            
            <ol>
                <li><Link to={`${props.match.url}/image`}>Change image(s)</Link></li>
                <li><Link to={`${props.match.url}/behaviour`}>Modify behaviour</Link></li>
            </ol>

            <div className="pieceEditor__navigation">
                <button onClick={props.saveData}>save piece</button>
            </div>
        </div>
    );
}

export default withRouter(PieceSummary);