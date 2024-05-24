import { FirebaseTimestamp, auth, db } from "../app/index";
import { useEffect, useRef, useState } from "react";
import { Order } from "../types/Order";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import "../../src/css/orderHistory.css";

export const OrderHistory = () => {
  const currentUser = auth.currentUser;
  const currentUserUid = currentUser?.uid;

  const orderData = db
    .collection(`userInformation`)
    .doc(currentUserUid)
    .collection("order");

  const [orderList, setOrderList] = useState<Array<Order>>([]);

  const getOrderHistory = async () => {
    const user = await db
      .collection("userInformation")
      .doc(currentUserUid)
      .get();
    const userData = user.data();

    await orderData.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const eachOrder = doc.data();

        setOrderList((prev) => [
          ...prev,
          {
            id: eachOrder.userId,
            userId: eachOrder.userId,
            status: eachOrder.status,
            totalPrice: eachOrder.totalPrice,
            orderDate: eachOrder.orderDate,
            destinationName: eachOrder.destinationName,
            destinationEmail: eachOrder.destinationEmail,
            destinationZipcode: eachOrder.destinationZipcode,
            destinationAddress: eachOrder.destinationAddress,
            destinationTel: eachOrder.destinationTel,
            deliveryTime: eachOrder.deliveryTime,
            paymentMethod: eachOrder.paymentMethod,
            user: {
              id: userData?.id,
              name: userData?.name,
              mailAddress: userData?.mailAddress,
              password: userData?.password,
              zipcode: userData?.zipcode,
              address: userData?.address,
              telephone: userData?.telephone,
            },
            orderItemList: eachOrder.orderItemFormList,
          },
        ]);
      });
    });
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  return (
    <div>
      <TableContainer>
        <Table
          sx={{ minWidth: 50, border: 2 }}
          aria-label="spanning table"
          padding="normal"
        >
          <TableRow>
            <TableCell scope="col" id="order-date" align="center">
              注文日
            </TableCell>
            <TableCell scope="col" id="order-detail" align="center">
              注文内容
            </TableCell>
          </TableRow>

          {orderList.map((order, orderIndex) => (
            // 注文日
            <TableRow key={orderIndex}>
              <TableCell headers="order-date" scope="row">
                {order.deliveryTime}
              </TableCell>
              {/* 注文内容 */}
              {order.orderItemList.map((itemInfo, itemIndex) => (
                <>
                  <TableRow>
                    <TableCell id="item-name" scope="col" align="center">
                      商品
                    </TableCell>
                    <TableCell id="item-size" scope="col" align="center">
                      サイズ
                    </TableCell>
                    <TableCell id="itemPrice" scope="col" align="center">
                      価格（税抜）
                    </TableCell>
                    <TableCell id="itemQuantity" scope="col" align="center">
                      数量
                    </TableCell>
                    <TableCell id="itemToppingList" scope="col" align="center">
                      トッピング／価格
                    </TableCell>
                    <TableCell id="totalPrice" scope="col" align="center">
                      合計
                    </TableCell>
                  </TableRow>
                  <TableRow key={itemIndex}>
                    <TableRow>
                      <TableCell headers="item-name">
                        商品名：{itemInfo.item.name}
                        <br />
                        <img src={itemInfo.item.imagePath} alt="" />
                      </TableCell>
                    </TableRow>
                    <TableCell headers="item-size">({itemInfo.size})</TableCell>
                    <TableCell>
                      {/* サイズの価格 */}
                      {(() => {
                        if (itemInfo.size === "M") {
                          return (
                            <TableCell headers="itemPrice">
                              ￥{itemInfo.item.priceM}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell headers="itemPrice">
                              ￥{itemInfo.item.priceL}
                            </TableCell>
                          );
                        }
                      })()}
                      {/* end of line  */}
                    </TableCell>
                    <TableCell>
                      <TableCell>{itemInfo.quantity}</TableCell>
                    </TableCell>
                    {/* orderTopping */}
                    {(() => {
                      if (itemInfo.orderToppingList.length !== 0) {
                        return (
                          <TableCell className="order-topping">
                            {itemInfo.orderToppingList.map((topping, index) => (
                              <TableCell key={index}>
                                <TableCell>{topping.Topping.name}/</TableCell>
                                {(() => {
                                  if (itemInfo.size === "M") {
                                    return (
                                      <TableCell>
                                        ￥{topping.Topping.priceM}
                                      </TableCell>
                                    );
                                  } else {
                                    return (
                                      <TableCell>
                                        ￥{topping.Topping.priceL}
                                      </TableCell>
                                    );
                                  }
                                })()}
                              </TableCell>
                            ))}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell className="order-topping"></TableCell>
                        );
                      }
                    })()}
                    <TableCell className="order-total-price">
                      ￥{order.totalPrice}
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </div>
  );
};
