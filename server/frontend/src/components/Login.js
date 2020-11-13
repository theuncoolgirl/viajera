import React, { useState } from "react";
import { useDispatch } from 'react-redux';
// import axiosInstance from "../axiosApi";
import { thunks } from "../store/session"

const Login = () => {

    const dispatch = useDispatch();
    const login = (username, password) => dispatch(thunks.login(username, password))
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const updateUsername = (e) => {
        setUsername(e.target.value)
    }

    const updatePassword = (e) => {
        setPassword(e.target.value)
    }

    const loginHandler = e => {
        e.preventDefault()
        login(username, password)
        //history.push('/')
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
        </div>
    )
}



// class Login extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { username: "", password: "" };
//         this.handleChange = this.handleChange.bind(this);
//         this.handleSubmit = this.handleSubmit.bind(this);
//     }

//     handleChange(event) {
//         this.setState({ [event.target.name]: event.target.value });
//     }

//     async handleSubmit(event) {
//         event.preventDefault();

//         try {
//             const response = await axiosInstance.post('/token/obtain/',
//                 { username: this.state.username, password: this.state.password }
//             );
//             axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     }

//     render() {
//         return (
//             <div>
//                 Login
//                 <form onSubmit={this.handleSubmit}>
//                     <label>
//                         Username:
//                         <input name="username" type="text" value={this.state.username} onChange={this.handleChange} />
//                     </label>
//                     <label>
//                         Password:
//                         <input name="password" type="password" value={this.state.password} onChange={this.handleChange} />
//                     </label>
//                     <input type="submit" value="Submit" />
//                 </form>
//             </div>
//         )
//     }
// }

export default Login;


