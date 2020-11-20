import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from "./Login";
import Signup from "./Signup";
import Hello from "./Hello";
import NavBar from "./NavBar";
import PlaceMap from "./PlaceMap";
import Search from "./Search";

const App = () => {
    return (
        <>
            <CssBaseline />
            <BrowserRouter>
                <div className="site">
                    <NavBar />
                    <main>
                        <Switch>
                            <Route exact path={"/login/"} component={Login} />
                            <Route exact path={"/signup/"} component={Signup} />
                            <Route exact path={"/hello/"} component={PlaceMap} />
                            <Route exact path={"/map/"} component={PlaceMap} />
                            <Route exact path={"/search/"} component={Search} />
                            <Route path={"/"} render={() => <div>Home again</div>} />
                            {/* eventually change render above to a 404 page */}
                        </Switch>
                    </main>
                </div>
            </BrowserRouter >
        </>
    );
}

export default App;