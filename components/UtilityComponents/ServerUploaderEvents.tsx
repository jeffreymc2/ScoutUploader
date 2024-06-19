// components/UtilityComponents/ServerUploaderEvents.tsx
import React from "react";
import { getUserData } from "@/lib/useUser";
import UploaderEvents from "@/components/UploaderEvents";

const ServerUserComponent = async (props: any) => {
    const user = await getUserData();
    return <UploaderEvents user={user} {...props} />;
};

export default ServerUserComponent;
