import { Box, Button, Container } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

import { CartListTable } from "../components/CartListTable";
import { useTotalPrice } from "../hooks/useTotalPrice";
import "../css/cartList.css";
import { cartListContext } from "../components/providers/CartListProvider";
import { useContext, useState } from "react";
import { ItemRecommendation } from "./ItemRecommendation";

export const CartList = () => {
  const navigate = useNavigate();
  const cart = useContext(cartListContext);

  //ショッピングカートの商品の合計金額を取得
  const totalPrice = useTotalPrice();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <ItemRecommendation open={open} handleClose={handleClose} />
      {cart?.cartList.length !== 0 ? (
        <Box className="cartList">
          <div className="context">
            <h1>ショッピングカート</h1>
            <div>
              <CartListTable hasButton={true}></CartListTable>
            </div>
            <div>
              <div>消費税：{totalPrice.TAXOfTotalPrice}円</div>
              <div>ご注文金額合計：{totalPrice.finallyTotalPrice}円 (税込)</div>
            </div>
            <div>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                onClick={() => {
                  handleOpen();
                }}
              >
                注文に進む
              </Button>
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
        </Box>
      ) : (
        <Box className="cartList">
          <div className="context">
            <span className="no-items">
              買い物かごには商品が入っていません。
            </span>
            現在、買い物かごには商品が入っていません。ぜひお買い物をお楽しみください。
            ご利用をお待ちしております。
            <Button onClick={() => navigate("/itemList")} color="primary">
              お買い物に戻る
            </Button>
          </div>
        </Box>
      )}
    </Container>
  );
};
