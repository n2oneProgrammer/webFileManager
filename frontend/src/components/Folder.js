import "../styles/FolderFile.css";
import {useContext} from "react";
import {PathContext} from "../Contexts";
import * as pathBrowserify from 'path-browserify';

export const Folder = ({name}) => {
    let [path, setPath] = useContext(PathContext);

    return (
        <div className={"element"} onClick={() => setPath(pathBrowserify.join(path, name))}>
            <div>
                <i className="fa-solid fa-folder icon"/>
                <h2>{name}</h2>
            </div>
        </div>
    )
}