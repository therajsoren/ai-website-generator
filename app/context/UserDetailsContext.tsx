import { createContext } from "react";

type UserDetailContextType = {
  userDetail: unknown;
  setUserDetail: (value: unknown) => void;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {},
});
