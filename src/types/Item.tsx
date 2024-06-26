import { Topping } from "./Topping";

export type Item = {
  deleted: boolean;
  description: string;
  id: number;
  imagePath: string;
  name: string;
  priceL: number;
  priceM: number;
  toppingList: Array<Topping>;
  type: string;
};
