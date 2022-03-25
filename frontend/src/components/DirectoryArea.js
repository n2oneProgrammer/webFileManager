import {Folder} from "./Folder";
import "../styles/DirectoryArea.css";
import {File} from "./File";
import {useContext} from "react";
import {FileManagerContext, NotifiesContext, PathContext} from "../Contexts";
import {PathLine} from "./PathLine";
import * as pathBrowserify from 'path-browserify';
import {Api} from "../Api";

export const DirectoryArea = (props) => {
    let [filesContext, setFilesContext] = useContext(FileManagerContext);
    let [addNotify, removeNotify] = useContext(NotifiesContext);
    let [root, setPath] = useContext(PathContext);
    const traverseFileTree = async (item, path) => {
        path = path || "";
        if (item.isFile) {
            // Get file
            await (new Promise((resolve) => item.file(async (file) => {
                let id = addNotify(file.name);
                await Api.upload(file, pathBrowserify.join(root, path, file.name));
                console.log("File:", path + file.name, file);
                removeNotify(id);
                resolve()
            })));
        } else if (item.isDirectory) {
            // Get folder contents
            let dirReader = item.createReader();
            await (new Promise((resolve) => dirReader.readEntries(async (entries) => {
                for (let i = 0; i < entries.length; i++) {
                    await traverseFileTree(entries[i], path + item.name + "/");
                }
                resolve();
            })));
        }
    };

    const onDropFiles = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        let items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();
            if (item) {
                await traverseFileTree(item);
                console.log("UPDATEEEEEEEEEEEEEEEEEEEEEEEEEEEEe");
                setFilesContext(await Api.getFiles(root))
            }
        }
    };
    const onDragFiles = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    console.log(filesContext);
    let dirs = null;
    if (filesContext != null) {
        dirs = Object.entries(filesContext).map(el => {
            if (el[1] === "FILE") {
                return <File key={el[0]} name={el[0]}/>
            }
            return <Folder key={el[0]} name={el[0]}/>
        });
        console.log(dirs)
    }


    return (
        <div className={"directory_area"} onDragOver={onDragFiles} onDrop={onDropFiles}>
            <PathLine/>
            {dirs}
        </div>
    )
}