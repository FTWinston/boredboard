import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './RegionCreator.css';
import { BoardDisplay } from '../../../components/board/BoardDisplay';
import { BoardDispatch } from '../BoardEditor';
import { IRegionCell } from '../boardReducer';
import { SelectorSingle } from '../components/SelectorSingle';

interface Props {
    boardUrl: string;
    cells: ReadonlySet<string>;
    regionCells: IRegionCell[]
    numPlayers: number;
    prevPage: string;
    nextPage: string;
}

export const RegionCreator: React.FunctionComponent<Props> = props => {
    const context = useContext(BoardDispatch);
    
    const [newRegionNames, setNewRegionNames] = useState<string[]>([]);

    const regionNames = useMemo(
        () => [
            ...new Set<string>([
                ...props.regionCells.map(rc => rc.region),
                ...newRegionNames
            ])
        ],
        [props.regionCells, newRegionNames]
    );

    const [selectedRegion, setSelectedRegion] = useState(regionNames.length > 0 ? regionNames[0] : '');

    const [selectedPlayer, setSelectedPlayer] = useState(0);

    const playerNames = useMemo(
        () => {
            const names = ['All players'];
            for (let i=1; i<=props.numPlayers; i++) {
                names.push(`Player ${i}`);
            }
            return names;
        },
        [props.numPlayers]
    );
    
    const currentRegionPlayerCells = useMemo(() => new Set(
            props.regionCells
                .filter(rc => rc.region === selectedRegion && rc.player === selectedPlayer)
                .map(rc => rc.cell)
        ),
        [props.regionCells, selectedRegion, selectedPlayer]
    );

    const cellClicked = (cell: string) => {
        context({
            type: currentRegionPlayerCells.has(cell)
                ? 'remove region cell'
                : 'add region cell',
            region: selectedRegion,
            player: selectedPlayer,
            cell,
        });
    };

    const removeRegion = useMemo(() => 
        () => {
            if (!window.confirm(`Remove the "${selectedRegion}" region?`)) {
                return;
            }

            context({
                type: 'remove region',
                region: selectedRegion
            });

            setSelectedRegion(regionNames.length > 0 ? regionNames[0] : '');

            setNewRegionNames(newRegionNames.filter(n => n !== selectedRegion));
        },
        [context, regionNames, selectedRegion, newRegionNames]
    )

    const promptAddNew = useMemo(() =>
        () => {
            let name = window.prompt('Enter new region name');

            if (name === null) {
                return;
            }

            name = name.trim();

            if (name.length === 0 || regionNames.includes(name) || newRegionNames.includes(name)) {
                return;
            }

            setNewRegionNames([
                ...newRegionNames,
                name
            ]);

            setSelectedRegion(name);
        },
        [newRegionNames, regionNames]
    )

    const promptRename = () => {
        let newName = window.prompt('Enter new name for this region', selectedRegion);
        if (newName === null) {
            return;
        }

        newName = newName.trim();

        if (newName.length === 0) {
            return;
        }

        setNewRegionNames(
            newRegionNames.map(n => n === selectedRegion ? newName! : n)
        );

        context({
            type: 'rename region',
            oldName: selectedRegion,
            newName: newName,
        });

        setSelectedRegion(newName);
    };

    return (
        <div className="boardEditor regionCreator">
            <BoardDisplay
                className="boardEditor__board"
                filePath={props.boardUrl}
                cells={props.cells}
                moveableCells={currentRegionPlayerCells}
                cellClicked={cellClicked}
            />

            <div className="boardEditor__content">
                <p>If pieces can behave differently in different parts of the board, you probably need to set up some regions.</p>
                <p>Enter a new region name or pick an existing one, then click on cells to add or remove them from the region, for all players or for a specific player.</p>

                <div className="boardEditor__listTitle">Region cells</div>

                <SelectorSingle
                    prefixText="Add cells to this region:"
                    radioGroup="region"
                    options={regionNames}
                    selectedValue={selectedRegion}
                    selectValue={setSelectedRegion}
                />

                <SelectorSingle
                    prefixText="For this player:"
                    radioGroup="player"
                    options={playerNames}
                    selectedValue={playerNames[selectedPlayer]}
                    selectValue={(_option, index) => setSelectedPlayer(index)}
                />

                <div className="boardEditor__buttonRow">
                    <button onClick={promptAddNew}>add new region</button>
                    <button disabled={selectedRegion === ''} onClick={removeRegion}>remove region</button>
                    <button disabled={selectedRegion === ''} onClick={promptRename}>rename region</button>
                </div>
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}