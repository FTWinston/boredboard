import React, { FunctionComponent, useContext, useMemo } from 'react'
import { Link } from 'react-router-dom';
import './EditorItemList.css';
import { GameDispatch } from '../../GameEditor';
import { Dictionary } from '../../../data/Dictionary';

interface Props {
    items: Dictionary<string, any>;
    itemType: 'board' | 'piece';
    rootUrl: string;
}

export const EditorItemList: FunctionComponent<Props> = props => {
    const context = useContext(GameDispatch);

    const itemNames = useMemo(
        () => Object.keys(props.items),
        [props.items]
    );

    const getEditUrl = useMemo(() => (
        (id: string) => `${props.rootUrl}/${props.itemType}/${id}`
    ), [props.rootUrl, props.itemType]);

    const removeItem = (id: string) => context({
        type: `remove ${props.itemType}` as 'remove board' | 'remove piece',
        id,
    })

    const renameItem = (oldID: string, newID: string) => context({
        type: `rename ${props.itemType}` as 'rename board' | 'rename piece',
        oldID,
        newID,
    });

    return (
        <div className="editorItemList">
            <h3 className="editorItemList__title">{props.itemType}s</h3>
            <ul className="editorItemList__list">
                {itemNames.map(name => (
                    <li className="editorItemList__listItem editorListItem" key={name}>
                        <span className="editorListItem__name">{name}</span>
                        <Link className="editorListItem__edit" to={getEditUrl(name)}>edit this {props.itemType}</Link>
                        <button className="editorListItem__rename" onClick={() => renameItem(name, 'TODO: Renaming')}>rename this {props.itemType}</button>
                        <button className="editorListItem__remove" onClick={() => removeItem(name)}>remove this {props.itemType}</button>
                    </li>
                ))}

                <li className="editorItemList__listItem editorListItem editorListItem--addNew">
                    <Link to={`${props.rootUrl}/${props.itemType}/new`}>add new {props.itemType}</Link>
                </li>
            </ul>
        </div>
    );
}