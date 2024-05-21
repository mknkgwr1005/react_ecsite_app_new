import { FirebaseTimestamp, auth, db } from "../app/index";
import { useEffect, useState } from "react";
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

    /**
     * 配列にpushする方法
     */
    await orderData.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const orderData = doc.data();

        setOrderList((beforeOrder) => [
          ...beforeOrder,
          {
            id: orderData.userId,
            userId: orderData.userId,
            status: orderData.status,
            totalPrice: orderData.totalPrice,
            orderDate: orderData.orderDate,
            destinationName: orderData.destinationName,
            destinationEmail: orderData.destinationEmail,
            destinationZipcode: orderData.destinationZipcode,
            destinationAddress: orderData.destinationAddress,
            destinationTel: orderData.destinationTel,
            deliveryTime: orderData.deliveryTime,
            paymentMethod: orderData.paymentMethod,
            user: {
              id: userData?.id,
              name: userData?.name,
              mailAddress: userData?.mailAddress,
              password: userData?.password,
              zipcode: userData?.zipcode,
              address: userData?.address,
              telephone: userData?.telephone,
            },
            orderItemList: orderData.orderItemFormList,
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
          sx={{ minWidth: 100, border: 2 }}
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

          {orderList.map((order, index) => (
            // 注文日
            <TableRow key={index}>
              <TableCell headers="order-date" scope="row">
                {order.deliveryTime}
              </TableCell>
              {/* 注文内容 */}
              {order.orderItemList.map((itemInfo, index) => (
                <>
                  <TableRow key={index}>
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
                  <TableRow key={index}>
                    <tr>
                      <td headers="item-name">
                        商品名：{itemInfo.item.name}
                        <br />
                        <img src={itemInfo.item.imagePath} alt="" />
                      </td>
                    </tr>
                    <td headers="item-size">({itemInfo.size})</td>
                    <td>
                      {/* サイズの価格 */}
                      {(() => {
                        if (itemInfo.size === "M") {
                          return (
                            <td headers="itemPrice">
                              ￥{itemInfo.item.priceM}
                            </td>
                          );
                        } else {
                          return (
                            <td headers="itemPrice">
                              ￥{itemInfo.item.priceL}
                            </td>
                          );
                        }
                      })()}
                      {/* end of line  */}
                    </td>
                    <td>
                      <td>{itemInfo.quantity}</td>
                    </td>
                    {/* orderTopping */}
                    {(() => {
                      if (itemInfo.orderToppingList.length !== 0) {
                        return (
                          <td className="order-topping">
                            {itemInfo.orderToppingList.map((topping, index) => (
                              <td key={index}>
                                <td>{topping.Topping.name}/</td>
                                {(() => {
                                  if (itemInfo.size === "M") {
                                    return <td>￥{topping.Topping.priceM}</td>;
                                  } else {
                                    return <td>￥{topping.Topping.priceL}</td>;
                                  }
                                })()}
                              </td>
                            ))}
                          </td>
                        );
                      } else {
                        return <td className="order-topping"></td>;
                      }
                    })()}
                    <td className="order-total-price">￥{order.totalPrice}</td>
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
