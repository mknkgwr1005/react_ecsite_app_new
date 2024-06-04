import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import "../css/orderHistory.css";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableHead from "@mui/material/TableHead";
import Pagination from "@mui/material/Pagination";
import { Order } from "../types/Order";

type historyType = {
  orderList: Order[];
  currentPage: number;
  orderLength: number;
  productsPerPage: number;
  changePage: (event: any, pagenum: number) => void;
};

export const OrderTable = ({
  orderList,
  currentPage,
  orderLength,
  productsPerPage,
  changePage,
}: historyType) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <TableContainer className="TableContainer" component={Paper}>
      <Table aria-label="customized table" padding="normal">
        <TableHead id="orderHeader">
          <TableRow>
            <StyledTableCell scope="col" id="orderDate" align="center">
              注文日
            </StyledTableCell>
            <StyledTableCell scope="col" id="orderDate" align="center">
              お届け日
            </StyledTableCell>
            <StyledTableCell scope="col" id="orderDetail" align="center">
              注文内容
            </StyledTableCell>
            <StyledTableCell scope="col" id="orderTotalPrice" align="center">
              合計金額（税込）
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList.map((order, orderIndex) => (
            // 注文日
            <StyledTableRow className="perOrderInfo" key={orderIndex}>
              <StyledTableCell className="orderDate" scope="row" component="th">
                {order.orderDate.toLocaleString("ja-JP")}
              </StyledTableCell>
              <StyledTableCell
                className="deliveryDate"
                scope="row"
                component="th"
              >
                {order.deliveryTime}
              </StyledTableCell>
              {/* 注文内容 */}
              {order.orderItemList.map((itemInfo, itemIndex) => (
                <>
                  <TableRow className="orderHeader">
                    <StyledTableCell id="itemName" scope="col" align="center">
                      商品
                    </StyledTableCell>
                    <StyledTableCell id="itemSize" scope="col" align="center">
                      サイズ
                    </StyledTableCell>
                    <StyledTableCell id="itemPrice" scope="col" align="center">
                      価格（税抜）
                    </StyledTableCell>
                    <StyledTableCell
                      id="itemQuantity"
                      scope="col"
                      align="center"
                    >
                      数量
                    </StyledTableCell>
                    <StyledTableCell id="itemToppingList" scope="col">
                      トッピング／価格
                    </StyledTableCell>
                  </TableRow>
                  <StyledTableRow className="perItemInfo" key={itemIndex}>
                    <StyledTableCell>
                      <div>
                        商品名：{itemInfo.item.name}
                        <br />
                        <img src={itemInfo.item.imagePath} alt="" />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell headers="itemSize">
                      ({itemInfo.size})
                    </StyledTableCell>
                    <>
                      {/* サイズの価格 */}
                      {(() => {
                        if (itemInfo.size === "M") {
                          return (
                            <StyledTableCell headers="itemPrice">
                              ￥{itemInfo.item.priceM}
                            </StyledTableCell>
                          );
                        } else {
                          return (
                            <StyledTableCell headers="itemPrice">
                              ￥{itemInfo.item.priceL}
                            </StyledTableCell>
                          );
                        }
                      })()}
                      {/* end of line  */}
                    </>
                    <StyledTableCell>{itemInfo.quantity}</StyledTableCell>
                    {/* orderTopping */}
                    {(() => {
                      if (itemInfo.orderToppingList.length !== 0) {
                        return (
                          <StyledTableCell className="orderTopping">
                            {itemInfo.orderToppingList.map((topping, index) => (
                              <StyledTableCell
                                key={index}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {topping.Topping.name}
                                {(() => {
                                  if (itemInfo.size === "M") {
                                    return (
                                      <span>￥{topping.Topping.priceM}</span>
                                    );
                                  } else {
                                    return (
                                      <span>￥{topping.Topping.priceL}</span>
                                    );
                                  }
                                })()}
                              </StyledTableCell>
                            ))}
                          </StyledTableCell>
                        );
                      } else {
                        return (
                          <StyledTableCell className="orderTopping"></StyledTableCell>
                        );
                      }
                    })()}
                  </StyledTableRow>
                </>
              ))}
              <StyledTableCell className="orderTotalPrice">
                ￥{order.totalPrice}
              </StyledTableCell>
            </StyledTableRow>
          ))}
          <Pagination
            defaultPage={1}
            page={currentPage}
            count={Math.ceil(orderLength / productsPerPage)}
            onChange={changePage}
            color="primary"
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
};
