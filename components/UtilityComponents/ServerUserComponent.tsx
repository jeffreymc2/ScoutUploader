// components/ServerUserComponent.tsx
import React from "react";
import { getUserData } from "@/lib/useUser";
import ClientUserComponent from "@/components/UtilityComponents/ClientUserComponent";

const ServerUserComponent = async () => {
  const user = await getUserData();

  return <ClientUserComponent user={user} />;
};

export default ServerUserComponent;
