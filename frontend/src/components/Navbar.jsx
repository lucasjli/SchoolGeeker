import React, { useContext } from "react";
import { UserContext } from "./UserContext";

function Navbar() {
    const { user } = React.useContext(UserContext);

    return (
        <div className="container-fluid mx-auto page-header navbar d-flex align-items-center fixed-top">
            <div className="WebsiteLogo d-flex align-items-center gap-2 mb-0">
                <a href="/">
                    <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/WebsiteLogo.png" width="50" alt="SchoolGeeker" id="logo" />
                </a>
                <div className="d-flex flex-column">
                    <a id="WebsiteName">SchoolGeeker</a>
                    <a id="Slogan">Discover excellent schools in NZ</a>
                </div>
            </div>

            <div className="d-flex flex-row gap-3 align-items-center justify-content-end" id="nav-name">
                <a href="/" className="nav-link fw-bold">Home Page</a>
                <span className="dot"></span>
                <a href="/schools?type=primary%20school" className="nav-link fw-bold">Primary School</a>
                <span className="dot"></span>
                <a href="/schools?type=intermediate%20school" className="nav-link fw-bold">Intermediate School</a>
                <span className="dot"></span>
                <a href="/schools?type=high%20school" className="nav-link fw-bold">High School</a>

                <div className="dropdown fs-nav user-info">
                    {user ? (
                        <a href="/usercenter">
                            <img
                                src={user.avatarURL || "https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/default_avatar.jpg"}
                                width="32"
                                alt="User Avatar"
                                style={{ borderRadius: "50%" }}
                            />
                        </a>
                    ) : (
                        <button type="button" className="btn p-0 border-0 bg-transparent" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <img src="https://objectstorage.ap-sydney-1.oraclecloud.com/n/sd2z6nfhfft4/b/SchoolGeeker/o/login_icon.png" width="30" alt="Login Icon" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;