import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Item } from "../types/Item";
import { Topping } from "../types/Topping";
import { cartListContext } from "../components/providers/CartListProvider";
import { OrderItem } from "../types/OrderItem";
import { ToppingListContext } from "../components/providers/ToppingListProvider";
import { OrderTopping } from "../types/OrderTopping";

export const ItemDetail = () => {
  // routerからitemidを取得する
  const { itemId } = useParams();

  useEffect(() => {
    axios
      .get("http://153.127.48.168:8080/ecsite-api/item/" + itemId)
      .then((response) => {
        setItem(response.data.item);
        // setToppingList(response.data.item.toppingList);
      });
  }, [itemId]);

  //商品のトッピング一覧
  const [toppingList, setToppingList] = useState<Array<Topping>>();
  // const toppingList = useContext(ToppingListContext);

  // トッピングを追加する
  // const addToppings = () => {
  //   const orderToppingList: OrderTopping = {
  //     id: 1,
  //     toppingId: 1,
  //     orderItemId: 1,
  //     Topping:(id:1,name:"",priceL:1,piceM:1,type:"")
  //   };
  //   toppingList?.setToppingList([...toppingList.toppingList,orderToppingList])
  // };

  // 商品一覧
  const [item, setItem] = useState<Item>({
    deleted: false,
    description: "",
    id: 0,
    imagePath: "",
    name: "",
    priceL: 0,
    priceM: 0,
    toppingList: [],
    type: "",
  });

  // サイズの初期値
  const [size, setSize] = useState<string>("M");
  // サイズ選択
  const [hasSize, setHasSize] = useState(true);
  //チェックボックス変更するメソッド
  const changeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasSize(!hasSize);
    setSize(() => e.target.value);
  };

  // 数量
  const [quantity, setQuantity] = useState<number>(100);

  //ショッピングカート
  const cart = useContext(cartListContext);

  // カートにいれる
  const pushInCartList = () => {
    const orderItem: OrderItem = {
      id: 1, //仮
      itemId: item.id,
      orderId: 1, //仮）オーダーのステートを作成し、そのIDを取ってくる
      quantity: quantity,
      size: size,
      item: item,
      orderToppingList: [],
    };
    cart?.setCartList([...cart.cartList, orderItem]);
    navigate("/CartList/");
  };

  //合計金額
  const totalPrices = (item.priceM + 200) * quantity;

  // カートにいれる
  // const cart = useContext(cartListContext);

  //画面遷移のメソッド化
  const navigate = useNavigate();

  return (
    <div>
      <h1>{item?.name}</h1>
      <img className="itemImage" src={item?.imagePath} alt="test" />
      <p>{item?.description}</p>
      <input
        id="M"
        name="size"
        type="radio"
        value="M"
        checked={hasSize}
        onChange={changeSize}
      />
      <label htmlFor="M"> M {item?.priceM}円</label>
      <input
        id="L"
        name="size"
        type="radio"
        value="L"
        checked={!hasSize}
        onChange={changeSize}
      />
      <label htmlFor="L">L {item?.priceL}円</label>
      <div>トッピング： 1つにつき Ｍ 200円(税抜) Ｌ 300 円(税抜)</div>
      {toppingList?.map((topping, index) => {
        return (
          <div>
            <label key={index}>
              <input
                type="checkbox"
                // onChange={(e) => setToppingList(e.target.value)}
                value={topping.name}
              />
              <span>{topping.name}</span>
            </label>
          </div>
        );
      })}
      <div>
        ; 数量
        <select
          className="quantity"
          name="quantity"
          id="pizzaQuantity"
          onChange={(e) => setQuantity(Number(e.target.value))}
          defaultValue="1"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>
      </div>
      <div>この商品金額：{totalPrices}円（税抜）</div>
      <div>
        <button
          onClick={() => {
            pushInCartList();
          }}
        >
          カートに入れる
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/itemList/");
          }}
        >
          商品一覧に戻る
        </button>
      </div>
    </div>
  );
};
