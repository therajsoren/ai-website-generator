"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserDetailContext } from "./context/UserDetailsContext";
const Provider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<any>();
  useEffect(() => {
    user && createNewUser();
  },[user]);
  const createNewUser = async () => {
    const result = await axios.post("/api/users", {});
    setUserDetail(result.data?.user);
    console.log(result.data);
  };
  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};
export default Provider;
