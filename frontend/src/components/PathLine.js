import {useContext} from "react";
import {PathContext} from "../Contexts";
import * as pathBrowserify from "path-browserify";
import "../styles/PathLine.css"

export const PathLine = () => {

    let [path, setPath] = useContext(PathContext);

    let dirs = path.slice(1).split("/");
    let prevPath = "/";
    let lines = [];
    dirs.forEach((el, i) => {
        let currPath = pathBrowserify.join(prevPath, el);
        lines.push((<span className={"link"} key={"path" + el} onClick={() => {
            setPath(currPath);
            console.log(currPath);
        }}> {el} </span>));
        if (i + 1 < dirs.length) {
            lines.push((<span key={"slash " + i + el}>/</span>));
        }
        prevPath = currPath;
    });
    console.log(path.slice(1), dirs, lines);

    return (
        <div className={"path_line"}>
            <span className={"link"} onClick={() => setPath("/")}>root</span> /
            {lines}
        </div>
    )
};