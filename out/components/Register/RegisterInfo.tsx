import { useState, useContext } from "react";
import { User } from "../../../src/types/User";
import React, { createContext, ReactNode } from "react";

type props = {
  children: ReactNode;
};

type registerUserType = {
  registerData: User;
  setregisterData: React.Dispatch<React.SetStateAction<User>>;
};

export const registerInfoContext = createContext<registerUserType | null>(null);

export const RegisterInfo: React.FC<props> = (props) => {
  const { children } = props;

  console.log("useStateが呼ばれた");

  const [registerData, setregisterData] = useState<User>({
    id: 0,
    name: { lastName: "", firstName: "" },
    mailAddress: "",
    password: "",
    zipcode: "",
    address: "",
    telephone: "",
  });

  return (
    <registerInfoContext.Provider value={{ registerData, setregisterData }}>
      {children}
    </registerInfoContext.Provider>
  );
};
