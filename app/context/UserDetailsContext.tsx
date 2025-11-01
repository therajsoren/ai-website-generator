import { createContext } from "react";

export type UserDetailType = {
  email?: string;
  name?: string;
  credits?: number;
};

type UserDetailContextType = {
  userDetail: UserDetailType | null;
  setUserDetail: (value: UserDetailType | null) => void;
};

export const UserDetailContext = createContext<UserDetailContextType>({
  userDetail: null,
  setUserDetail: () => {},
});
