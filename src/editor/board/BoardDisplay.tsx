import React from 'react';
import useFetch from 'react-fetch-hook';
import './BoardDisplay.css';

interface Props {
    filepath: string;
}

export const BoardDisplay: React.FC<Props> = props => {
    const { isLoading, data } = useFetch(props.filepath,{
        formatter: (response) => response.text()
    });

    if (isLoading || data === undefined) {
        return <div className="board board--loading" />
    }

    return (
        <div className="board" dangerouslySetInnerHTML={{__html: data}} />
    );
}