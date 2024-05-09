import { Name } from "./Name";

export type UserInfo = {
  name?: Name;
  mailAddress?: string;
  password?: number;
  zipCode?: number;
  address?: string;
  telephone?: number;
  itemTotalPrice?: number;
  deliveryDate?: string;
  deliveryHour?: number;
  paymentMethod?: number;
};
