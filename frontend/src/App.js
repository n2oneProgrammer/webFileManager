import React, {useEffect, useState} from 'react';
import {HeaderComponent} from "./components/HeaderComponent";
import {DirectoryArea} from "./components/DirectoryArea";
import {ContextMenu, FileManagerContext, PathContext} from "./Contexts";
import {Api} from "./Api";
import {ContextMenuComponent} from "./components/ContextMenuComponent";


const App = () => {
    const [files, setFiles] = useState(null);
    const [path, setPath] = useState("/");
    const [contextMenuShow, setcontextMenuShow] = useState(false);
    const [contextMenuXPos, setcontextMenuXPos] = useState(0);
    const [contextMenuYPos, setcontextMenuYPos] = useState(0);
    const [contextMenuOptions, setcontextMenuOptions] = useState([]);
    useEffect(async () => {
        let data = await Api.getFiles(path);
        setFiles(data);
    }, [path]);

    const showContextMenu = (e, options) => {
        e.preventDefault();
        setcontextMenuXPos(e.clientX);
        setcontextMenuYPos(e.clientY);
        setcontextMenuShow(true);
        setcontextMenuOptions(options);
    };

    const hideContextMenu = (e) => {
        e.preventDefault();
        setcontextMenuShow(false);
    };

    let contextMenuFunctions = {
        show: showContextMenu,
        hide: hideContextMenu
    };
    return (

        <ContextMenu.Provider value={contextMenuFunctions}>
            <PathContext.Provider value={[path, setPath]}>
                <FileManagerContext.Provider value={[files, setFiles]}>
                    <div className="App" onClick={hideContextMenu}>
                        <ContextMenuComponent visible={contextMenuShow} x={contextMenuXPos} y={contextMenuYPos}
                                              options={contextMenuOptions}/>
                        <HeaderComponent/>
                        <DirectoryArea/>
                    </div>
                </FileManagerContext.Provider>
            </PathContext.Provider>
        </ContextMenu.Provider>
    );
};
export default App