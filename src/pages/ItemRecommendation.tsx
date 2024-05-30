import React, { useState, useEffect } from "react";
import axios from "axios";
import { Item } from "../types/Item";
import { Link } from "react-router-dom";
import { View } from "react-native";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import "../css/itemRecommendation.css";
import CloseIcon from "@mui/icons-material/Close";

type reccomendType = {
  open: boolean;
  handleClose: () => void;
};

export const ItemRecommendation = ({ open, handleClose }: reccomendType) => {
  const ItemListUrl = "http://153.127.48.168:8080/ecsite-api/item/items/pizza";
  // itemListというstate名で、メソッド名をsetItemListとし、useStateを使用して初期値を設定する。
  const [itemList, setItemList] = useState<Array<Item>>([]);

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "40px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  useEffect(() => {
    // axios呼び出し
    axios.get(ItemListUrl).then((response) => {
      // itemListにreponsedataをセットする
      setItemList(() => response.data.items);
    });
  }, []);

  // ランダム用のID作成
  const randomID: number[] = [];

  for (let i = 0; i <= itemList.length; i++) {
    randomID.push(Math.random());
  }

  // APIのアイテムをソートし、ランダムで生成したIDのindexに該当するアイテムを表示する
  itemList.sort((a, b) => {
    return randomID[itemList.indexOf(a)] - randomID[itemList.indexOf(b)];
  });

  // 表示数の調整
  for (let i = 1; i <= 3; i++) {
    itemList.splice(1, itemList.length - 3);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        width: "1300px",
        alignContent: "space-around",
        margin: "auto",
      }}
    >
      <Box sx={{ ...style }}>
        <div className="item-box">
          <div className="close-modal">
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
          <div id="order-reminder">この商品も一緒にいかがですか？</div>
          <View
            style={{
              // 横並びにする
              flexDirection: "row",
              // はみ出る場合、下に折り返す
              flexWrap: "wrap",
            }}
          >
            {itemList.map((item: Item) => {
              return (
                <Grid key={item.id}>
                  <br />
                  <div className="item-img">
                    <Link to={`/ItemDetail/${item.id}`}>
                      <img src={`${item.imagePath}`} alt="images" />
                    </Link>
                  </div>
                  <span id="item-name">{item.name}</span>
                  <br />
                  <div className="item-price">
                    <span>Mサイズ：￥{item.priceM}</span>
                    &nbsp;&nbsp;
                    <span>Lサイズ：￥{item.priceL}</span>
                  </div>
                  <div>
                    <Link to={`/itemDetail/${item.id}`}>
                      <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                      >
                        注文する
                      </Button>
                    </Link>
                  </div>
                </Grid>
              );
            })}
          </View>
          <div className="cancel-button">
            <Link to={`/OrderComfirm/`}>
              <Button type="button" variant="contained" color="default">
                注文せずに進む
              </Button>
            </Link>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
