import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { thunks } from "../store/session";

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const login = (username, password) => dispatch(thunks.login(username, password))
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = (e) => setUsername(e.target.value)
    const updatePassword = (e) => setPassword(e.target.value)

    const loginHandler = e => {
        e.preventDefault()
        login(username, password)
    }

    const popDemoUser = e => {
        e.preventDefault()
        login("demo-user", "demopassword123")
        history.push('/map/')
    }

    return (
        <div
            style={{
                width: 500,
                backgroundColor: "white",
                margin: "auto"
            }}>
            <form onSubmit={loginHandler} >
                <div>
                    <label>
                        Username:
                        <input name="username" type="text" value={username} onChange={updateUsername} style={{ height: 24, border: 0, width: 300, display: "block", margin: "0 auto" }} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input name="password" type="password" value={password} onChange={updatePassword} style={{ height: 24, border: 0, width: 300, display: "block", margin: "0 auto" }} />
                    </label>
                </div>
                <div>
                    <input className={"listButton"} type="submit" value="Submit" style={{ width: 150, display: "block", margin: "10px auto" }} />
                    <button className={"listButton"} onClick={popDemoUser} style={{ width: 150, display: "block", margin: "10px auto" }}>Demo User</button>
                </div>
            </form>

        </div>
    )
}

export default Login;


