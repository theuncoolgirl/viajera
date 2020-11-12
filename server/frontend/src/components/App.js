import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Hello from "./Hello";

class App extends Component {
    render() {
        return (
            <div className="site">
                <nav>
                    <Link className={"nav-link"} to={"/"}>Home</Link>
                    <Link className={"nav-link"} to={"/login/"}>Login</Link>
                    <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
                    <Link className={"nav-link"} to={"/hello/"}>Hello</Link>
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