"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const [userDetail, setUserDetails] = useState<UsersDetail | null>(null);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/users");
    console.log(result.data);
    setUserDetails(result.data);
  };

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetails }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
