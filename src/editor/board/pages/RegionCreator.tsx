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
            ...new Set<string>(props.regionCells.map(rc => rc.region)),
            ...newRegionNames,
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
                <p>Click on cells to add or remove them from the selected region, for the selected player(s).</p>

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
            </div>

            <div className="boardEditor__navigation">
                <Link to={props.prevPage}>Back</Link>
                <Link to={props.nextPage}>Continue</Link>
            </div>
        </div>
    );
}