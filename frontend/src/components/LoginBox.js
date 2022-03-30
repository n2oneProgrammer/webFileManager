import "../styles/LoginBox.css";
import {useContext, useState} from "react";
import {Api} from "../Api";

export const LoginBox = ({active, updateFile}) => {
    const [loginValue, setLoginValue] = useState("");
    const [passValue, setPassValue] = useState("");
    if (!active) return null;

    const login = () => {
        Api.login(loginValue, passValue).then(() => updateFile());
    };


    return (
        <div className={"background"}>
            <form className={"form"}>
                <label>Login: <input value={loginValue} onChange={(e) => setLoginValue(e.target.value)}/></label>
                <label>Password: <input type="password" value={passValue}
                                        onChange={(e) => setPassValue(e.target.value)}/></label>
                <input type="button" value="Login" onClick={login}/>
            </form>
        </div>
    )
};