import * as pathBrowserify from 'path-browserify';

export class Api {
    static async getFiles(src) {
        let url = "";
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let data = await fetch(url + "/get?pos=" + src);
        let json = await data.json();
        console.log(json);
        return json;
    }

    static async upload(file, path) {
        let url = "";
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let body = new FormData();
        body.append("file", file);
        body.append("path", path);

        await fetch(`${url}/upload`, {
            method: "POST",
            body: body
        });
    }

    static async rename(old, newName) {
        let url = "";
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let data = await fetch(`${url}/rename?old=${old}&newname=${newName}`, {
            method: "POST"
        });
        let json = await data.json();
    }

    static async download(path) {
        let url = "";
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let response = await fetch(`${url}/download?path=${path}`);
        let blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = pathBrowserify.basename(path);
        link.click();
    }

}