import React, { Component, useState } from "react";
import { useDispatch } from 'react-redux';
import { thunks } from "../store/session";
import axiosInstance from "../axiosApi";

const Signup = () => {
    const dispatch = useDispatch();
    const signup = (first_name, last_name, username, email, password) => {
        dispatch(thunks.signup(first_name, last_name, username, email, password))
    }

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");

    const updateFirstName = (e) => setFirstName(e.target.value);
    const updateLastName = (e) => setLastName(e.target.value);
    const updateUsername = (e) => setUsername(e.target.value);
    const updateEmail = (e) => setEmail(e.target.value);
    const updatePassword = (e) => setPassword(e.target.value);

    const signupHandler = e => {
        e.preventDefault()
        signup(first_name, last_name, username, email, password)
    }

    return (
        <div>
            Signup
            <form onSubmit={signupHandler}>
                <label>
                    First Name:
                        <input name="first_name" type="text" value={first_name} onChange={updateFirstName} />
                    {errors && errors.first_name ? errors.first_name : null}
                </label>
                <label>
                    Last Name:
                        <input name="last_name" type="text" value={last_name} onChange={updateLastName} />
                    {errors && errors.last_name ? errors.last_name : null}
                </label>
                <label>
                    Username:
                        <input name="username" type="text" value={username} onChange={updateUsername} />
                    {errors && errors.username ? errors.username : null}
                </label>
                <label>
                    Email:
                        <input name="email" type="email" value={email} onChange={updateEmail} />
                    {errors && errors.email ? errors.email : null}
                </label>
                <label>
                    Password:
                        <input name="password" type="password" value={password} onChange={updatePassword} />
                    {errors && errors.password ? errors.password : null}
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Signup;