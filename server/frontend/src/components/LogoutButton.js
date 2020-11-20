import React, { Component } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { thunks } from "../store/session";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const logout = () => dispatch(thunks.logout());

    const logoutHandler = e => {
        e.preventDefault()
        logout()
        console.log("HISTORY: ", history);
        history.push("/login/")
    }

    return (
        <button className={"navButton"} onClick={logoutHandler}>Logout</button>
    )
}

export default LogoutButton;