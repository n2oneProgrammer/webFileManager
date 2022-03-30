import React, {useEffect, useState} from 'react';
import {HeaderComponent} from "./components/HeaderComponent";
import {DirectoryArea} from "./components/DirectoryArea";
import {ContextMenu, FileManagerContext, NotifiesContext, PathContext} from "./Contexts";
import {Api, User} from "./Api";
import {ContextMenuComponent} from "./components/ContextMenuComponent";
import {Notifies} from "./components/Notifies";
import {LoginBox} from "./components/LoginBox";

const App = () => {
    const [files, setFiles] = useState(null);
    const [path, setPath] = useState("/");
    const [contextMenuShow, setcontextMenuShow] = useState(false);
    const [contextMenuXPos, setcontextMenuXPos] = useState(0);
    const [contextMenuYPos, setcontextMenuYPos] = useState(0);
    const [contextMenuOptions, setcontextMenuOptions] = useState([]);
    const [notifiesTable, setNotifiesTable] = useState([]);
    const [isActiveLoginBox, setActiveLoginBox] = useState(false);

    useEffect(() => {
        let updateFiles = async () => {
            let data = await Api.getFiles(path);
            setFiles(data);
        };
        updateFiles();
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

    const addNotify = (text) => {
        let id = notifiesTable[notifiesTable.length - 1];
        setNotifiesTable(notifiesTable.concat([{id: id, text: text}]));
        return id;
    };
    let removeNotify = (id) => {
        setNotifiesTable(notifiesTable.filter(el => el.id !== id));
    };
    User.showLoginBox = () => {
        setActiveLoginBox(true);
    };
    User.hideLoginBox = async () => {
        setActiveLoginBox(false);
        let data = await Api.getFiles(path);
        setFiles(data);
    };
    return (
        <NotifiesContext.Provider value={[addNotify, removeNotify]}>
            <ContextMenu.Provider value={contextMenuFunctions}>
                <PathContext.Provider value={[path, setPath]}>
                    <FileManagerContext.Provider value={[files, setFiles]}>
                        <Notifies notifiesTable={notifiesTable}/>
                        <div className="App" onClick={hideContextMenu}>
                            <ContextMenuComponent visible={contextMenuShow} x={contextMenuXPos} y={contextMenuYPos}
                                                  options={contextMenuOptions}/>
                            <HeaderComponent/>
                            <DirectoryArea/>
                            <LoginBox active={isActiveLoginBox} updateFile={async () => {
                                let data = await Api.getFiles(path);
                                setFiles(data);
                            }}/>
                        </div>
                    </FileManagerContext.Provider>
                </PathContext.Provider>
            </ContextMenu.Provider>
        </NotifiesContext.Provider>
    );
};
export default App;