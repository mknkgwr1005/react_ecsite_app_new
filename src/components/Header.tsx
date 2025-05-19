import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { cartListContext } from "./providers/CartListProvider";
import { StatusButton } from "../components/statusButton";
import Box, { BoxProps } from "@mui/material/Box";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { statusContext } from "./providers/statusContext";

const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const cart = useContext(cartListContext);
  const userStatus = useContext(statusContext);

  return (
    <div>
      <AppBar
        position="static"
        style={{ color: "#e0f2f1", backgroundColor: "#004d40" }}
      >
        <Toolbar>
          <img
            src="../pizzaLOGO.png"
            alt="PIZZA"
            width="40"
            onClick={() => navigate("/")}
          ></img>
          <Typography variant="h5">
            宅配ピザ（出前・デリバリーピザ）の らくらくPIZZA
          </Typography>
          <Box
            sx={{
              justifyContent: "flex-end",
              p: 1,
              m: 1,
              borderRadius: 1,
            }}
          >
            {userStatus?.statusCheck ? (
              <></>
            ) : (
              <Button color="inherit" onClick={() => navigate("/registerUser")}>
                ユーザー登録
              </Button>
            )}
            <StatusButton />
            <Button color="inherit" onClick={() => navigate("/ItemList")}>
              商品一覧
            </Button>
            {userStatus?.statusCheck ? (
              <Button color="inherit" onClick={() => navigate("/OrderHistory")}>
                注文履歴
              </Button>
            ) : (
              <></>
            )}
            {userStatus?.statusCheck ? (
              <IconButton
                color="primary"
                aria-label="add to shopping cart"
                onClick={() => navigate("/CartList")}
              >
                <Badge badgeContent={cart?.cartList.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            ) : (
              <></>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
