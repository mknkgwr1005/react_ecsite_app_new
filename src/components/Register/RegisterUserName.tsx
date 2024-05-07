import { useState } from "react";
import React, { createContext, ReactNode } from "react";
import { Name } from "../../types/Name";

type props = {
  children: ReactNode;
};

type registerUserNameType = {
  registerName: Name;
  setregisterName: React.Dispatch<React.SetStateAction<Name>>;
};

export const registerUserNameContext =
  createContext<registerUserNameType | null>(null);

export const RegisterUserName: React.FC<props> = (props) => {
  const { children } = props;

  const [registerName, setregisterName] = useState<Name>({
    lastName: "",
    firstName: "",
  });

  return (
    <registerUserNameContext.Provider value={{ registerName, setregisterName }}>
      {children}
    </registerUserNameContext.Provider>
  );
};
