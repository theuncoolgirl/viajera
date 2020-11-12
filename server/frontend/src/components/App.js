import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Hello from "./Hello";
import axiosInstance from "../axiosApi";

class App extends Component {
    // constructor and handleLogout can be eventually moved to a nav component
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
        try {
            const response = await axiosInstance.post('/blacklist/',
                { "refresh_token": localStorage.getItem("refresh_token") }
            );
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            axiosInstance.defaults.headers['Authorization'] = null;
            return response;
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        return (
            <div className="site">
                <nav>
                    <Link className={"nav-link"} to={"/"}>Home</Link>
                    <Link className={"nav-link"} to={"/login/"}>Login</Link>
                    <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                    <Link className={"nav-link"} to={"/hello/"}>Hello</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                </nav>
                <main>
                    <h1>Ahhh after 10,000 years I'm free. Time to conquer the Earth!</h1>
                    <Switch>
                        <Route exact path={"/login/"} component={Login} />
                        <Route exact path={"/signup/"} component={Signup} />
                        <Route exact path={"/hello/"} component={Hello} />
                        <Route path={"/"} render={() => <div>Home again</div>} />
                        {/* eventually change render above to a 404 page */}
                    </Switch>
                </main>
            </div>
        );
    };
};

export default App;