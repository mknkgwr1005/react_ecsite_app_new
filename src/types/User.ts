import { Name } from "./Name";

export type User = {
  id: string;
  name?: Name;
  mailAddress: string;
  password: string;
  zipcode: string;
  address: string;
  telephone: string;
};
