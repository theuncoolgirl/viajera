import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
    return (
        <nav className="navBar">
            <div>
                <Link className={"nav-link"} to={"/"}>Viajera</Link>
            </div>
            {/* <Link className={"nav-link"} to={"/login/"}>Login</Link> */}
            <div>
                <Link className={"nav-link"} to={"/signup/"}><button className={"navButton"}>Signup</button></Link>
                {/* <Link className={"nav-link"} to={"/hello/"}>Hello</Link> */}
                {/* <Link className={"nav-link"} to={"/map/"}>Map</Link> */}
                <LogoutButton />
            </div>
        </nav>
    )
}

export default NavBar;