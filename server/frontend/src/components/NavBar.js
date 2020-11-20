import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
    return (
        <nav className="navBar">
            <Link className={"nav-link"} to={"/"}>Home</Link>
            <Link className={"nav-link"} to={"/login/"}>Login</Link>
            <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
            <Link className={"nav-link"} to={"/hello/"}>Hello</Link>
            <Link className={"nav-link"} to={"/map/"}>Map</Link>
            <Link className={"nav-link"} to={"/search/"}>Search</Link>
            <LogoutButton />
        </nav>
    )
}

export default NavBar;