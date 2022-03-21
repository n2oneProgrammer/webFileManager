import {Folder} from "./Folder";
import "../styles/DirectoryArea.css";
import {File} from "./File";
import {useContext} from "react";
import {FileManagerContext, PathContext} from "../Contexts";
import {PathLine} from "./PathLine";
import * as pathBrowserify from 'path-browserify';
import {Api} from "../Api";

export const DirectoryArea = (props) => {
    let [filesContext, setFilesContext] = useContext(FileManagerContext);
    let [root, setPath] = useContext(PathContext);
    const traverseFileTree = (item, path) => {
        path = path || "";
        if (item.isFile) {
            // Get file
            item.file((file) => {
                Api.upload(file, pathBrowserify.join(root, path, file.name)).then(() => console.log("upload"))
                    .then(async () => setFilesContext(await Api.getFiles(root)));
                console.log("File:", path + file.name, file);
            });
        } else if (item.isDirectory) {
            // Get folder contents
            let dirReader = item.createReader();
            dirReader.readEntries((entries) => {
                for (let i = 0; i < entries.length; i++) {
                    traverseFileTree(entries[i], path + item.name + "/");
                }
            });
        }
    };

    const onDropFiles = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();
            if (item) {
                traverseFileTree(item);
            }
        }
    }
    const onDragFiles = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log(filesContext)
    let dirs = null;
    if (filesContext != null) {
        dirs = Object.entries(filesContext).map(el => {
            if (el[1] === "FILE") {
                return <File key={el[0]} name={el[0]}/>
            }
            return <Folder key={el[0]} name={el[0]}/>
        })
        console.log()
        console.log(dirs)
    }


    return (
        <div className={"directory_area"} onDragOver={onDragFiles} onDrop={onDropFiles}>
            <PathLine/>
            {dirs}
        </div>
    )
}