"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetailContext, UserDetailType } from "./context/UserDetailsContext";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<UserDetailType | null>(null);

  useEffect(() => {
    if (user) createNewUser();
  }, [user]);

  const createNewUser = async () => {
    const result = await axios.post("/api/users", {});
    setUserDetail(result.data?.user);
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default Provider;
