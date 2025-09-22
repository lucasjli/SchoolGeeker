import React from "react";
import { UserProvider } from "./components/UserContext";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

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
    // Use a wrapper to conditionally render BackToTop based on route
    function BackToTopWrapper() {
        const location = useLocation();
        // Only show BackToTop when not on homepage
        return location.pathname !== "/" ? <BackToTop /> : null;
    }
    return (
        <UserProvider>
            <Router>
                {/* Global modal component */}
                <LoginModal />
                <BackToTopWrapper />
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