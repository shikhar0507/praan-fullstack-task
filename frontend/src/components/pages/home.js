import React from "react";
import { Navigate } from 'react-router-dom';
import { useUser } from "../../utils/auth";

import Dashboard from "./dashboard";

function Home() {
    const { state } = useUser();
    if (state.isAuthenticated) {
        return (
            <div>
                <Dashboard></Dashboard>
            </div>
        )
    }
    return <Navigate to="/signup"></Navigate>
}

export default Home