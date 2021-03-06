import "../styles/FolderFile.css";
import {useContext, useState} from "react";
import {ContextMenu, FileManagerContext, PathContext} from "../Contexts";
import * as pathBrowserify from 'path-browserify';
import {Api} from "../Api";

export const Folder = ({name}) => {
    let [path, setPath] = useContext(PathContext);
    const contextMenu = useContext(ContextMenu);
    let [, setFilesContext] = useContext(FileManagerContext);
    let [editMode, setEditMode] = useState(false);
    let [inputSize, setInputSize] = useState(`${name.length + 1}ch`);
    let [inputText, setInputText] = useState(name);

    const rename = (e) => {
        setEditMode(true);
    };


    const inputResize = (e) => {
        setInputSize(`${e.target.value.length + 1}ch`);
        setInputText(e.target.value);
    };
    const enterEdit = async () => {
        let old = pathBrowserify.join(path, name);
        console.log("rename");
        await Api.rename(old, inputText);
        setEditMode(false);
        setFilesContext(await Api.getFiles(path));
    };

    const contextOptions = [
        ["rename", rename],
        ["download", () => Api.download(pathBrowserify.join(path, name), name + ".zip")],
        ["delete", () => Api.remove(pathBrowserify.join(path, name))
            .then(async () => setFilesContext(await Api.getFiles(path)))]
    ];
    return (
        <div className={"element"} onContextMenu={(e) => {
            contextMenu.show(e, contextOptions)
        }} onClick={() => setPath(pathBrowserify.join(path, name))}>
            <div>
                <i className="fa-solid fa-folder icon"/>
                <h2>{editMode ? (
                    <input autoFocus={true} onInput={inputResize} style={{width: inputSize}} onBlur={enterEdit}
                           value={inputText} onKeyPress={(e) => e.key === "Enter" ? enterEdit() : null}/>) : name}</h2>
            </div>
        </div>
    )
};