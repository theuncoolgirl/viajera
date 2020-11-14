// GET a message from a protected API endpoint on the backend, and display it,
// using our custom axios instance again.

import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunks } from "../store/message";

const Hello = () => {
    const dispatch = useDispatch();
    const getMessage = () => dispatch(thunks.getMessage());
    const message = useSelector(state => state.message.message)

    useEffect(() => {
        getMessage();
        console.log("messageonhello: ", message)
    }, [dispatch]);

    return (
        <div>
            <p>{message}</p>
        </div>
    )

}

export default Hello;