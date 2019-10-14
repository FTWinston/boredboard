import React, { useContext, useState, useMemo } from 'react';
import { BoardDispatch } from '../BoardEditor';
import { ILink, isDuplicateLink } from '../boardReducer';
import { SelectAllNone } from './SelectAllNone';
import { SelectorSingle } from './SelectorSingle';

interface Props {
    className?: string;
    cells: string[];
    linkTypes: string[];
    links: ILink[];
    direction: ScreenDirection;
    getBoardElements: () => NodeListOf<Element>;
    setDirection: (dir: ScreenDirection) => void;
    distance: number;
    setDistance: (dist: number) => void;
    selectedCells: string[];
    setSelectedCells: (cells: string[]) => void;
}

interface ICreationInfo {
    previousLinks: ILink[];
    numAdded: number;
    numNoCell: number;
    numSelf: number;
    numDuplicate: number;
    linkType: string;
}

export type ScreenDirection = 'up' | 'down' | 'left' | 'right' | 'up & left' | 'up & right' | 'down & left' | 'down & right';
const screenDirections: ScreenDirection[] = ['up', 'down', 'left', 'right', 'up & left', 'up & right', 'down & left', 'down & right'];

export const MultiLinkSetup: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);

    const [selectedLinkType, setSelectedLinkType] = useState(props.linkTypes[0]);

    const [creationInfo, setCreationInfo] = useState(undefined as ICreationInfo | undefined);

    const [resultDisplay, undoButton] = useMemo(() => {
        if (creationInfo === undefined) {
            return [undefined, undefined];
        }

        const { numAdded, numNoCell, numSelf, numDuplicate, linkType, previousLinks } = creationInfo;

        const undo = () => {
            context({
                type: 'set links',
                links: previousLinks,
            });
            setCreationInfo(undefined);
        };

        const messages = [`Created ${numAdded} ${props.linkTypes.length <= 1 ? '' : linkType} link${numAdded === 1 ? '' :'s'}.`];
        
        if (numNoCell > 0) {
            messages.push(`Failed to create ${numNoCell} link${numNoCell === 1 ? ' as it' :'s as they'} didn't end in a cell.`);
        }

        if (numSelf > 0) {
            messages.push(`Didn't create ${numSelf} link${numSelf === 1 ? ' as it' :'s as they'} ended in the same cell as ${numSelf === 1 ? 'it' : 'they'} started in.`);
        }

        if (numDuplicate > 0) {
            messages.push(`Didn't create ${numDuplicate} link${numDuplicate === 1 ? ' as it' :'s as they'} already existed.`);
        }

        const undoButton = creationInfo.numAdded === 0
            ? undefined
            : <button onClick={undo}>Undo creation</button>

        return [
            <ul>
                {messages.map((m, i) => <li key={i}>{m}</li>)}
            </ul>,
            undoButton
        ]
    }, [creationInfo, context, props.linkTypes.length]);

    const createLinks = (newLinks: ILink[], numNoCell: number, numSelf: number) => {
        const linksToAdd = newLinks.filter(l => !isDuplicateLink(l, props.links));

        setCreationInfo({
            linkType: selectedLinkType,
            numAdded: linksToAdd.length,
            numNoCell,
            numSelf,
            numDuplicate: newLinks.length - linksToAdd.length,
            previousLinks: props.links,
        });

        if (linksToAdd.length > 0) {
            context({
                type: 'add links',
                links: linksToAdd,
            });
        }
    }

    const linkTypeSelector = props.linkTypes.length <= 1
        ? undefined
        : <SelectorSingle
            prefixText="Link type:"
            radioGroup="linkType"
            options={props.linkTypes}
            selectedValue={selectedLinkType}
            selectValue={setSelectedLinkType}
        />

    return (
        <div className={props.className}>
            <div className="boardEditor__listTitle">Create links</div>

            <SelectAllNone
                selectAll={
                    props.cells.length === props.selectedCells.length
                        ? undefined
                        : () => props.setSelectedCells(props.cells)
                }
                selectNone={
                    props.selectedCells.length === 0
                        ? undefined
                        : () => props.setSelectedCells([])
                }
            />
            
            {linkTypeSelector}

            <SelectorSingle
                prefixText="Screen direction:"
                radioGroup="screenDir"
                options={screenDirections}
                selectedValue={props.direction}
                selectValue={val => props.setDirection(val as ScreenDirection)}
            />

            <p>
                <button onClick={() => props.setDistance(props.distance * 1.2)}>Increase distance</button>
                &nbsp;
                <button onClick={() => props.setDistance(props.distance / 1.2)}>Decrease distance</button>
            </p>

            <p>
                <button
                    disabled={props.selectedCells.length === 0}
                    onClick={() => tryCreateLinks(props.getBoardElements, props.selectedCells, props.distance, props.direction, selectedLinkType, createLinks)}
                >
                    Create links
                </button>
                
                {undoButton}
            </p>

            {resultDisplay}
        </div>
    );
}

export function getAngle(direction: ScreenDirection) {
    switch (direction) {
        case 'up':
            return -90;
        case 'down':
            return 90;
        case 'left':
            return 180;
        case 'up & left':
            return -135;
        case 'up & right':
            return -45;
        case 'down & left':
            return 135;
        case 'down & right':
            return 45;
        default:
            return 0;
    }
}

function tryCreateLinks(
    getBoardElements: () => NodeListOf<Element>,
    selectedCells: string[],
    distance: number,
    screenDir: ScreenDirection,
    linkType: string,
    setResults: (newLinks: ILink[], numNoCell: number, numSelf: number) => void
) {
    const angle = getAngle(screenDir) * Math.PI / 180;

    const contentItems = getBoardElements();

    const newLinks: ILink[] = [];
    let numNoCell = 0;
    let numSelf = 0;

    for (const item of contentItems) {
        const fromCell = item.getAttribute('data-cell');
        if (fromCell === null || selectedCells.indexOf(fromCell) === -1) {
            continue;
        }
        
        const bounds = item.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const testX = centerX + distance * Math.cos(angle);
        const testY = centerY + distance * Math.sin(angle);

        const toElement = document.elementFromPoint(testX, testY);
        if (toElement === null) {
            numNoCell++;
            continue;
        }

        const toCell = toElement.id;
        if (toCell === '') {
            numNoCell++;
            continue;
        }
 
        if (toCell === fromCell) {
            numSelf++;
            continue;
        }

        // TODO: ensure we're still in the svg?

        newLinks.push({
            fromCell,
            toCell,
            type: linkType,
        });
    }

    setResults(newLinks, numNoCell, numSelf);
}