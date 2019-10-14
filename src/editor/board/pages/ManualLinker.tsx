import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './ManualLinker.css';
import { BoardDisplay } from '../../../components/board';
import { BoardDispatch } from '../BoardEditor';
import { ILink } from '../boardReducer';
import { BoardLinkList } from '../components/BoardLinkList';
import { SingleLinkSetup } from '../components/SingleLinkSetup';
import { LabelStyle } from '../../../data/LabelSize';

interface Props {
    boardUrl: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    nextPage: string;
}

export const ManualLinker: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [selectedLinkType, setSelectedLinkType] = useState(props.linkTypes[0]);

    const [linkFrom, setLinkFrom] = useState(null as string | null);

    const [linkedTo, setLinkedTo] = useState(null as string | null);

    const cellClicked = (cell: string) => {
        if (linkFrom === null || linkedTo !== null) {
            setLinkFrom(cell);
            setLinkedTo(null);
            return;
        }

        if (cell === linkFrom) {
            setLinkFrom(null);
            setLinkedTo(null);
            return;
        }

        // TODO: if there's already a link with the same from / to / type,
        // don't add a new one. But also make it clear that this is the case.

        setLinkedTo(cell);
        context({
            type: 'add link',
            fromCell: linkFrom,
            toCell: cell,
            linkType: selectedLinkType,
        });
    };
    
    const undoAdd = () => {
        if (linkFrom !== null && linkedTo !== null) {
            context({
                type: 'remove link',
                fromCell: linkFrom,
                toCell: linkedTo,
                linkType: selectedLinkType,
            });
        }

        setLinkFrom(null);
        setLinkedTo(null);
    };

    return (
        <div className="boardEditor manualLinker">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                labelStyle={LabelStyle.FillCell}
                selectableCells={linkFrom === null ? undefined : [linkFrom]}
                moveableCells={linkedTo === null ? undefined : [linkedTo]}
                cellClicked={cellClicked}
            />
            
            <div className="boardEditor__content">
                <p>
                    You can link individual pairs of cells here, or remove specific links.
                </p>

                <div className="manualLinker__columns">
                    <SingleLinkSetup
                        className="manualLinker__createLink"
                        linkTypes={props.linkTypes}
                        selectedLinkType={selectedLinkType}
                        linkFrom={linkFrom}
                        linkedTo={linkedTo}
                        selectLinkType={type => {
                            setSelectedLinkType(type);

                            // Changing link type makes it unclear what you would undo,
                            // so remove the ability to undo.
                            if (linkedTo !== null) {
                                setLinkFrom(null);
                                setLinkedTo(null);
                            }
                        }}
                        undoAdd={undoAdd}
                    />
                    <BoardLinkList
                        links={props.links}
                        linkTypes={props.linkTypes}
                        className="manualLinker__existingLinks"
                    />
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to="/bulklinks">Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}