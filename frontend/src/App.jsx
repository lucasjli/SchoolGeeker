import React from "react";
import { UserProvider } from "./components/UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './css/schooldetail.css';
import './css/homepage.css';
import './css/schoollist.css';
import './css/backtotop.css';
import './css/usercenter.css';

import SchoolDetail from "./components/SchoolDetail";
import LoginModal from "./components/LoginModal";
import Homepage from "./components/Homepage";
import SchoolList from "./components/SchoolList";
import BackToTop from "./components/BackToTop";
import UserCenter from "./components/UserCenter";

function App() {
    return (
        <UserProvider>
            <Router>
                {/* Global modal component */}
                <LoginModal />
                {/* Back to top button */}
                <BackToTop />

                {/* Page routes */}
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/schools/:schoolId" element={<SchoolDetail />} />
                    <Route path="/schools" element={<SchoolList />} />
                    <Route path="/usercenter" element={<UserCenter />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;