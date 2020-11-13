// GET a message from a protected API endpoint on the backend, and display it,
// using our custom axios instance again.

import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../axiosApi";
import { thunks } from "../store/message";

const Hello = () => {
    const dispatch = useDispatch();
    const getMessage = () => dispatch(thunks.getMessage());
    const message = useSelector(state => state.message.message)
    // const [message, setMessage] = useState("");

    useEffect(() => {
        getMessage();
        // const message = useSelector(state => state.message.message)
        console.log("messageonhello: ", message)
    }, [dispatch]);

    return (
        <div>
            <p>{message}</p>
            {/* <p>Placeholder</p>
            {console.log("message in component: ", message)} */}
        </div>
    )

}

// class Hello extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             message: "",
//         };
//         this.getMessage = this.getMessage.bind(this)
//     }

//     async getMessage() {
//         try {
//             let response = await axiosInstance.get('/hello/');
//             const message = response.data.hello;
//             this.setState({ message: message, });
//             return message;
//         } catch (error) {
//             window.location.href = '/login/';
//             // when refactored for redux, change to useHistory
//             console.log("Error: ", JSON.stringify(error, null, 4));
//             throw error;
//         }
//     }

//     componentDidMount() {
//         const messageData1 = this.getMessage();
//         console.log("messageData1: ", JSON.stringify(messageData1, null, 4));
//     }

//     render() {
//         return (
//             <div>
//                 <p>{this.state.message}</p>
//             </div>
//         )
//     }
// }

export default Hello;