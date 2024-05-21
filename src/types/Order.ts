import { OrderItem } from "./OrderItem";
import { User } from "./User";

export type Order = {
  id: string;
  userId: number;
  status: number;
  totalPrice: number;
  orderDate: Date;
  destinationName: string;
  destinationEmail: string;
  destinationZipcode: string;
  destinationAddress: string;
  destinationTel: string;
  deliveryTime: Date;
  paymentMethod: number;
  user: User;
  orderItemList: Array<OrderItem>;
};
