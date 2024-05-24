import { OrderTopping } from "./OrderTopping";

export type OrderHistoryType = {
  id: number;
  orderDate: Date;
  itemName: string;
  itemPrice: number;
  itemQuantity: number;
  itemTopping: OrderTopping;
  toppingPrice: number;
  subTotal: number;
  totalPrice: number;
};
