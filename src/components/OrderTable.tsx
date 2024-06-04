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
        <TableHead id="order-header">
          <TableRow>
            <StyledTableCell scope="col" id="order-date" align="center">
              注文日
            </StyledTableCell>
            <StyledTableCell scope="col" id="order-date" align="center">
              お届け日
            </StyledTableCell>
            <StyledTableCell scope="col" id="order-detail" align="center">
              注文内容
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderList.map((order, orderIndex) => (
            // 注文日
            <StyledTableRow className="per-order-info" key={orderIndex}>
              <StyledTableCell
                className="order-date"
                scope="row"
                component="th"
              >
                {order.orderDate.toLocaleString("ja-JP")}
              </StyledTableCell>
              <StyledTableCell
                className="delivery-date"
                scope="row"
                component="th"
              >
                {order.deliveryTime}
              </StyledTableCell>
              {/* 注文内容 */}
              {order.orderItemList.map((itemInfo, itemIndex) => (
                <>
                  <TableRow className="order-header">
                    <StyledTableCell id="item-name" scope="col" align="center">
                      商品
                    </StyledTableCell>
                    <StyledTableCell id="item-size" scope="col" align="center">
                      サイズ
                    </StyledTableCell>
                    <StyledTableCell id="item-price" scope="col" align="center">
                      価格（税抜）
                    </StyledTableCell>
                    <StyledTableCell
                      id="item-quantity"
                      scope="col"
                      align="center"
                    >
                      数量
                    </StyledTableCell>
                    <StyledTableCell id="item-topping-list" scope="col">
                      トッピング／価格
                    </StyledTableCell>
                    <StyledTableCell
                      id="total-price"
                      scope="col"
                      align="center"
                    >
                      合計
                    </StyledTableCell>
                  </TableRow>
                  <StyledTableRow className="per-item-info" key={itemIndex}>
                    <StyledTableCell>
                      <div>
                        商品名：{itemInfo.item.name}
                        <br />
                        <img src={itemInfo.item.imagePath} alt="" />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell headers="item-size">
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
                          <StyledTableCell className="order-topping">
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
                          <StyledTableCell className="order-topping"></StyledTableCell>
                        );
                      }
                    })()}
                    <StyledTableCell className="order-total-price">
                      ￥{order.totalPrice}
                    </StyledTableCell>
                  </StyledTableRow>
                </>
              ))}
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
