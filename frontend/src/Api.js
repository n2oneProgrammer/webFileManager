export class User {
    static token = "";
    static showLoginBox;
    static hideLoginBox;
}

export class Api {
    static async getFiles(src) {
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }

        console.log("token", User.token);
        let data = await fetch(`${url}/get?pos=${src}`, {
            headers: {
                "Authorization": `Bearer ${User.token}`
            }
        });
        if (data.status !== 200) {
            User.token = "";
            User.showLoginBox();
        }
        let json = await data.json();
        console.log(json);
        return json;
    }

    static async upload(file, path) {
        let body = new FormData();
        body.append("file", file);
        body.append("path", path);
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        await fetch(`${url}/upload`, {
            method: "POST",
            body: body,
            headers: {
                "Authorization": `Bearer ${User.token}`
            },
        });
    }

    static async rename(old, newName) {
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        await fetch(`${url}/rename?old=${old}&newname=${newName}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${User.token}`
            },
        });
    }

    static async remove(path) {
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        await fetch(`${url}/delete?path=${path}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${User.token}`
            },
        });
    }

    static async download(path, name) {
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let response = await fetch(`${url}/download?path=${path}`, {
            headers: {
                "Authorization": `Bearer ${User.token}`
            },
        });
        let blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.click();
    }

    static async login(login, password) {
        let url = document.URL;
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:8000";
        }
        let body = new FormData();
        body.append("username", login);
        body.append("password", password);
        let token = await fetch(`${url}/login`, {
            method: "POST",
            body: body
        });
        if (token.status !== 200) {
            return;
        }
        let json = await token.json();
        console.log(json);
        User.token = json.access_token;
        User.hideLoginBox();

    }
}