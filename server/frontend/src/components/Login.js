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
        history.push('/hello/')
    }

    return (
        <div>
            Login
            <form onSubmit={loginHandler}>
                <label>
                    Username:
                        <input name="username" type="text" value={username} onChange={updateUsername} />
                </label>
                <label>
                    Password:
                        <input name="password" type="password" value={password} onChange={updatePassword} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <button onClick={popDemoUser}>Demo User</button>
        </div>
    )
}

export default Login;


