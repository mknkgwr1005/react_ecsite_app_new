import { FirebaseTimestamp, auth, db } from "../app/index";
import { useCallback, useEffect, useRef, useState } from "react";
import { Order } from "../types/Order";
import "../css/orderHistory.css";
import { OrderTable } from "../components/OrderTable";

export const OrderHistory = () => {
  const currentUser = auth.currentUser;
  const currentUserUid = currentUser?.uid;

  const orderData = db
    .collection(`userInformation`)
    .doc(currentUserUid)
    .collection("order");

  // 画面に表示する商品リスト
  const [orderList, setOrderList] = useState<Array<Order>>([]);
  // ページごとに表示する件数
  const [productsPerPage, setProductsPerPage] = useState(5);
  // 現在のページ
  const [currentPage, setCurrentPage] = useState(1);
  // 注文データの全体の件数
  const [orderLength, setOrderLength] = useState(1);

  /**
   * 注文情報を表示する
   *
   */
  const getOrderHistory = async () => {
    try {
      let query = orderData.orderBy("orderDate", "desc");
      const allProductLength = (await query.get()).docs.length;
      setOrderLength(allProductLength);

      // ページ1の時だけの処理
      if (
        productsPerPage > 0 &&
        allProductLength > productsPerPage &&
        currentPage === 1
      ) {
        query = query.limit(productsPerPage);
      }

      // ほかのページに移動したときの処理
      if (currentPage > 1) {
        const orderData = await query.get();
        const lastSnapshotIndex = productsPerPage * (currentPage - 1) - 1;

        if (lastSnapshotIndex < orderData.docs.length) {
          const lastSnapshot = orderData.docs[lastSnapshotIndex];
          query = query.startAfter(lastSnapshot).limit(productsPerPage);
        }
      }

      // 注文履歴を表示
      const userSnapshot = await db
        .collection("userInformation")
        .doc(currentUserUid)
        .get();
      const userData = userSnapshot.data();

      const orderSnapshot = await query.get();
      const orders = orderSnapshot.docs.map((doc) => {
        const eachOrder = doc.data();
        const newTimeStamp = new Date(eachOrder.orderDate.toDate());

        return {
          id: eachOrder.userId,
          userId: eachOrder.userId,
          status: eachOrder.status,
          totalPrice: eachOrder.totalPrice,
          orderDate: newTimeStamp,
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
        };
      });
      setOrderList(orders);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const handleChangePage = (value: number) => {
    setCurrentPage(value);
  };

  const changePage = (event: any, pagenum: number) => {
    handleChangePage(pagenum);
  };

  useEffect(() => {
    getOrderHistory();
  }, [currentPage, productsPerPage, currentUserUid]);

  return (
    <>
      <OrderTable
        orderList={orderList}
        currentPage={currentPage}
        orderLength={orderLength}
        productsPerPage={productsPerPage}
        changePage={changePage}
      />
    </>
  );
};
