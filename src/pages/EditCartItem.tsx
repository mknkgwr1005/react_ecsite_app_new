/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext, FC } from "react";
import { useNavigate } from "react-router-dom";
import { cartListContext } from "../components/providers/CartListProvider";
import { OrderItem } from "../types/OrderItem";
import { OrderTopping } from "../types/OrderTopping";
import { EditContext } from "../components/providers/EditProvider";
import "../css/editCartItem.css";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";

export const EditCartItem: FC = () => {
  //画面遷移のメソッド化
  const navigate = useNavigate();

  //編集するオーダー商品を取得
  const editOrderItem = useContext(EditContext);
  const orderItem = editOrderItem?.editOrderItem;

  // サイズの初期値
  const [size, setSize] = useState<string>();
  //編集する商品のサイズを初期値に設定
  useEffect(() => {
    setSize(orderItem?.size);
  }, []);

  // サイズ表示
  const [hasSize, setHasSize] = useState(true);
  //デフォルトのサイズ表示を設定
  useEffect(() => {
    if (orderItem?.size === "L") {
      setHasSize(!hasSize);
    }
  }, []);
  //サイズを変更するメソッド
  const changeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasSize(!hasSize);
    const size2 = e.target.value;
    setSize(() => size2);
    changeTotalPrice();
  };

  // チェックしたトッピングのIDリスト
  const [selectedToppingIdList, setselectedToppingIdList] = useState<
    Array<number>
  >([]);
  //トッピングIDリストの初期値を編集するもののIDリストで上書きする
  useEffect(() => {
    const idArr = new Array<number>();
    if (orderItem !== undefined) {
      for (const orderTopping of orderItem?.orderToppingList) {
        idArr.push(orderTopping.Topping.id);
      }
    }
    setselectedToppingIdList(idArr);
  }, []);

  //選択したトッピングのIDをトッピングIDリストに格納する
  const getSelectedTopping = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      const toppingId: number = Number(event.target.value);
      const selectedToppingIdList2 = selectedToppingIdList;
      selectedToppingIdList2.push(toppingId);
      // トッピングをリストに収納
      setselectedToppingIdList(() => selectedToppingIdList2);
    } else {
      const selectedToppingIdList2 = selectedToppingIdList;
      for (let i = 0; i < selectedToppingIdList2.length; i++) {
        if (selectedToppingIdList2[i] === Number(event.target.value)) {
          selectedToppingIdList2.splice(i, 1);
        }
      }
      setselectedToppingIdList(() => selectedToppingIdList2);
    }
  };

  // 数量
  const [quantity, setQuantity] = useState<number>(1);
  //数量を編集するものの数量に置き換える
  useEffect(() => {
    if (orderItem !== undefined) {
      setQuantity(orderItem?.quantity);
    }
  }, []);

  //ショッピングカート
  const cart = useContext(cartListContext);

  // カートにいれる
  const pushInCartList = () => {
    // トッピングリストをチェックしたもののみに絞り込み
    const filteredToppingList = orderItem?.item.toppingList?.filter(
      (topping) => {
        // 選択したトッピングの数繰り返す
        for (let checkedToppingId of selectedToppingIdList) {
          // APIのトッピングと同じだった場合
          if (topping.id === checkedToppingId) {
            return true;
          }
        }
        return false;
      }
    );

    // カートにいれるためにOrderTopping型に変換する
    const newOrderToppingList = new Array<OrderTopping>();

    // 選択したトッピングごとに繰り返し、変換用の配列に格納する
    // //idの採番
    let orderToppingId = 0;
    if (filteredToppingList !== undefined && orderItem !== undefined) {
      for (let topping of filteredToppingList) {
        const orderTopping = topping;
        newOrderToppingList.push({
          id: orderToppingId,
          toppingId: orderTopping.id,
          orderItemId: orderItem.id,
          Topping: orderTopping,
        });
        orderToppingId++;
      }
    }

    // カートに商品を入れる
    if (
      orderItem !== undefined &&
      size !== undefined &&
      editOrderItem?.index !== undefined
    ) {
      const orderItem2: OrderItem = {
        id: orderItem?.id,
        itemId: orderItem.item.id,
        orderId: orderItem.orderId, //仮）オーダーのステートを作成し、そのIDを取ってくる
        quantity: quantity,
        size: size,
        item: orderItem.item,
        orderToppingList: newOrderToppingList,
      };
      cart?.setCartList((cartList) => {
        const cartList2 = cartList;
        cartList2.splice(editOrderItem?.index, 1, orderItem2);
        return cartList2;
      });
      navigate("/CartList/");
    }
  };

  // 合計金額
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const changeTotalPrice = () => {
    setTotalPrice(() => {
      if (orderItem !== undefined) {
        const selectedToppings = selectedToppingIdList.length;
        if (size === "M") {
          const toppingPrice = selectedToppings * 200;
          return (orderItem.item.priceM + toppingPrice) * quantity;
        } else if (size === "L") {
          const toppingPrice = selectedToppings * 300;
          return (orderItem.item.priceL + toppingPrice) * quantity;
        }
      }
      return 0;
    });
  };

  useEffect(() => {
    changeTotalPrice();
  }, [size, quantity]);

  return (
    <div className="editCartItem">
      <h1>{orderItem?.item?.name}</h1>
      <img className="itemImage" src={orderItem?.item?.imagePath} alt="test" />
      <p>{orderItem?.item?.description}</p>
      <input
        id="M"
        name="size"
        type="radio"
        value="M"
        checked={hasSize}
        onChange={(e) => {
          changeSize(e);
        }}
      />
      <label htmlFor="M"> M {orderItem?.item?.priceM}円</label>
      <input
        id="L"
        name="size"
        type="radio"
        value="L"
        checked={!hasSize}
        onChange={(e) => {
          changeSize(e);
        }}
      />
      <label htmlFor="L">L {orderItem?.item?.priceL}円</label>
      <div>トッピング： 1つにつき Ｍ 200円(税抜) Ｌ 300 円(税抜)</div>
      <div className="topping">
        {orderItem?.item.toppingList?.map((topping, index) => {
          let checked = false;
          for (const topping2 of orderItem.orderToppingList) {
            if (topping2.Topping.id === topping.id) {
              checked = true;
            }
          }
          return (
            <FormGroup key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={checked}
                    onChange={(e) => {
                      getSelectedTopping(e);
                      changeTotalPrice();
                    }}
                    value={topping.id}
                  />
                }
                label={topping.name}
              />
            </FormGroup>
          );
        })}
      </div>
      <FormControl>
        <InputLabel id="pizzaQuantity">数量</InputLabel>
        <Select
          className="quantity"
          label="quantity"
          labelId="pizzaQuantity"
          onChange={(e) => {
            setQuantity(Number(e.target.value));
            changeTotalPrice();
          }}
          defaultValue={Number(orderItem?.quantity)}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={11}>11</MenuItem>
          <MenuItem value={12}>12</MenuItem>
        </Select>
      </FormControl>
      <div>この商品金額： {totalPrice}円（税抜）</div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            pushInCartList();
          }}
        >
          編集する
        </Button>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/itemList/");
          }}
        >
          商品一覧に戻る
        </Button>
      </div>
    </div>
  );
};
