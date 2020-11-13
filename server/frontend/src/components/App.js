import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { GoogleMap, useLoadScript, Market, InfoWindow } from "@react-google-maps/api";
import Login from "./Login";
import Signup from "./Signup";
import Hello from "./Hello";
import NavBar from "./NavBar";

const App = () => {
    return (
        <BrowserRouter>
            <div className="site">
                <NavBar />
                <main>
                    <h1>Main Section</h1>
                    <Switch>
                        <Route exact path={"/login/"} component={Login} />
                        <Route exact path={"/signup/"} component={Signup} />
                        <Route exact path={"/hello/"} component={Hello} />
                        <Route path={"/"} render={() => <div>Home again</div>} />
                        {/* eventually change render above to a 404 page */}
                    </Switch>
                </main>
            </div>
        </BrowserRouter >
    );
}

export default App;