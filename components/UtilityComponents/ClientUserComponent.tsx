// components/ClientUserComponent.tsx
"use client";

import React from "react";

const ClientUserComponent = ({ user }: { user: any }) => {
    if (!user) {
        return <div>No user data available.</div>;
    }

    return (
        <div>
            <h1>{user.display_name}</h1>
            <p>{user.email}</p>
            {/* Render other user details here */}
        </div>
    );
};

export default ClientUserComponent;
