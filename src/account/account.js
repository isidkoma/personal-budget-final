import React, { useState, useEffect } from "react";

import { reactLocalStorage } from "reactjs-localstorage";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [errorMessage] = useState("");

    useEffect(() => {
        const storedUsername = reactLocalStorage.get("username");
        setUsername(storedUsername || "User");
    }, []);
    

    const signOut = () => {
        // Remove the JWT and username from local storage and navigate to home
        reactLocalStorage.remove("jwt");
        reactLocalStorage.remove("username");
        navigate("/");
    };

 

    return (
        <main className="center" id="main">
            <div id="account">
                <h1 className="row">Personal Account Management</h1>
                <div>
                    <p>Hello, <strong>{username}</strong>!</p>
                </div>
                <div>
                    <button onClick={() => navigate("/dashboard")}>Go To Dashboard</button>
                </div>
                <div>
                    <button onClick={signOut}>Sign Out</button>
                </div>
                <div>
                    <button onClick={() => navigate("/change_password")}>Change Password</button>
                </div>
                <div>
                    <button id="deleteButton" onClick={() => navigate("/delete_account")}>Delete Account</button>
                </div>
                {errorMessage && <div><p id="errorMessage">{errorMessage}</p></div>}
            </div>
        </main>
    );
};

export default Account;
