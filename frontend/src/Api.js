export class Api {
    static async getFiles(src) {
        let data = await fetch(document.URL + "/get?pos=" + src);
        let json = await data.json();
        console.log(json);
        return json;
    }

    static async upload(file, path) {
        let body = new FormData();
        body.append("file", file);
        body.append("path", path);

        await fetch(`${document.URL}/upload`, {
            method: "POST", body: body
        });
    }

    static async rename(old, newName) {
        await fetch(`${document.URL}/rename?old=${old}&newname=${newName}`, {
            method: "POST"
        });
    }

    static async remove(path) {
        await fetch(`${document.URL}delete?path=${path}`, {
            method: "POST"
        });
    }

    static async download(path, name) {
        let response = await fetch(`${document.URL}download?path=${path}`);
        let blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
    }

}