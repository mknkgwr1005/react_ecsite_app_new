import React, { FC, useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CartListTable } from "../components/CartListTable";
import { useTotalPrice } from "../hooks/useTotalPrice";
import "../css/orderConfirm.css";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { userContext } from "../components/providers/UserInfoContext";
import { FirebaseTimestamp, auth, db } from "../app/index";
import { cartListContext } from "../components/providers/CartListProvider";

export const OrderComfirm: FC = () => {
  // firebaseからユーザー情報を反映させる
  const currentUser = auth.currentUser;
  const currentUserUid = currentUser?.uid;

  const navigate = useNavigate();
  const totalPrice = useTotalPrice();
  //ユーザーが入力した情報
  const userStatus = useContext(userContext);
  const orderItem = useContext(cartListContext);

  //配達時間の表示の為の配列
  const deliveryHourArr = [10, 11, 12, 13, 14, 15, 16, 17, 18];
  //注文のAPIの配達日時フォーマット
  const [deliveryTime, setDeliveryTime] = useState("");
  const [today, setToday] = useState(new Date());
  const [dateisCorrect, setDateisCorrext] = useState(false);
  const [handleOrderButton, setHandleOrderButton] = useState(true);

  // deliveryDateとdeliveryHourを注文のAPIのフォーマットに整形
  useEffect(() => {
    setDeliveryTime(() => {
      const deliveryTime = format(
        new Date(
          userStatus?.userInfo.deliveryDate +
            "T" +
            userStatus?.userInfo.deliveryHour +
            ":00:00"
        ),
        "yyyy/MM/dd HH:mm:ss"
      );
      return deliveryTime;
    });
  }, [userStatus?.userInfo.deliveryDate, userStatus?.userInfo.deliveryHour]);

  //注文失敗時のエラーメッセージ
  const [orderErrorMessage, setOrderErrorMessage] = useState("");

  /**
   * 日付指定のときに、同じ条件で比較するために今日の日付のHMSMを設定する
   */
  const setTodaysHour = () => {
    today.setHours(9);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
  };

  const handleTodayDate = () => {
    setToday(new Date());
  };

  /**
   * 商品を注文する.
   */
  const order = async () => {
    let ordered = false;
    const lastNameStr = userStatus?.userInfo.name?.lastName;
    const firstNameStr = userStatus?.userInfo.name?.firstName;
    let fullName = "";
    if (lastNameStr !== undefined && firstNameStr !== undefined) {
      fullName = lastNameStr + firstNameStr;
    } else return;

    setOrderErrorMessage(() => "");

    if (currentUser && currentUserUid) {
      const timeStamp = FirebaseTimestamp.now();
      const orderInformation = {
        orderDate: timeStamp,
        userId: currentUserUid,
        status: 0,
        totalPrice: totalPrice.finallyTotalPrice,
        destinationName: fullName,
        destinationEmail: userStatus?.userInfo.mailAddress,
        destinationZipcode: userStatus?.userInfo.zipCode,
        destinationAddress: userStatus?.userInfo.address,
        destinationTel: userStatus?.userInfo.telephone,
        deliveryTime: deliveryTime,
        paymentMethod: userStatus?.userInfo.paymentMethod,
        orderItemFormList: orderItem?.cartList, //仮
      };

      await db
        .collection(`userInformation`)
        .doc(currentUserUid)
        .collection("order")
        .add(orderInformation)
        .then(() => {
          ordered = true;
          navigate("/OrderFinished");
        });
    } else return;

    if (ordered) {
      orderItem?.setCartList([]);
    } else return;
  };

  let inputUserName = {
    lastName: "",
    firstName: "",
  };
  let inputUserEmail = "";
  let inputUserZipCode = 0;
  let inputUserAddress = "";
  let inputUserTelephone = 0;

  /**
   * 自動入力
   */

  const autoComplete = async () => {
    const userInfoRef = db.collection("userInformation");

    const currentUserData = (
      await userInfoRef.doc(currentUserUid).get()
    ).data();

    inputUserName = currentUserData?.name;
    inputUserEmail = currentUserData?.email;
    inputUserZipCode = currentUserData?.zipcode;
    inputUserAddress = currentUserData?.address;
    inputUserTelephone = currentUserData?.telephone;

    // 郵便番号のフォーマット
    const stringZipCode = String(inputUserZipCode);
    const formatZipCode = stringZipCode.replace("-", "");
    const numberZipCode = Number(formatZipCode);

    // 名前のフォーマット

    // 入力欄を更新
    userStatus?.setUserInfo({
      ...userStatus?.userInfo,
      name: inputUserName,
      mailAddress: inputUserEmail,
      zipCode: numberZipCode,
      address: inputUserAddress,
      telephone: inputUserTelephone,
    });
  };

  // Stateに名前を送信する
  const setUserName = (lastNameData?: string, firstNameData?: string) => {
    userStatus?.setUserInfo({
      ...userStatus.userInfo,
      name: { lastName: lastNameData, firstName: firstNameData },
    });
  };

  return (
    <div className="orderConfirm">
      <div className="context">
        <CartListTable hasButton={false}></CartListTable>
        <div>
          <div>消費税：{totalPrice.TAXOfTotalPrice}円</div>
          <div>ご注文金額合計：{totalPrice.finallyTotalPrice}円 (税込)</div>
        </div>
        <div className="form">
          <h2>---お届け先情報---</h2>
          <Button type="button" variant="contained" onClick={autoComplete}>
            自動入力
          </Button>
          <div>
            <TextField
              className="textField"
              label="lastname"
              variant="outlined"
              id="name"
              type="text"
              value={userStatus?.userInfo.name?.lastName}
              onChange={(e) => {
                setUserName(e.currentTarget.value, undefined);
              }}
            />
            <TextField
              className="textField"
              label="firstname"
              variant="outlined"
              id="name"
              type="text"
              value={userStatus?.userInfo.name?.firstName}
              onChange={(e) => {
                setUserName(undefined, e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <TextField
              className="textField"
              label="email"
              variant="outlined"
              id="email"
              type="email"
              value={userStatus?.userInfo.mailAddress}
              onChange={(e) => {
                userStatus?.setUserInfo({
                  ...userStatus?.userInfo,
                  mailAddress: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <div className="zipCode">
              <TextField
                className="textField"
                label="zipCode"
                variant="outlined"
                id="zipcode"
                type="number"
                value={userStatus?.userInfo.zipCode}
                onChange={(e) => {
                  userStatus?.setUserInfo({
                    ...userStatus?.userInfo,
                    zipCode: Number(e.target.value),
                  });
                }}
              />
              <Button type="button" variant="contained">
                住所検索
              </Button>
            </div>
          </div>
          <div>
            <div>
              <TextField
                className="textField"
                label="address"
                variant="outlined"
                id="address"
                type="text"
                value={userStatus?.userInfo.address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  userStatus?.setUserInfo({
                    ...userStatus?.userInfo,
                    address: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div>
            <TextField
              className="textField"
              label="telephone"
              variant="outlined"
              id="tel"
              type="number"
              value={userStatus?.userInfo.telephone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                userStatus?.setUserInfo({
                  ...userStatus?.userInfo,
                  telephone: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <div className="form">
              <h2>---配達日時---</h2>
              <TextField
                className="textField"
                // label="deliveryDate"
                variant="outlined"
                id="deliveryDate"
                type="date"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  userStatus?.setUserInfo(() => {
                    setTodaysHour();
                    const selectedDate = new Date(e.target.value);
                    if (selectedDate < today) {
                      setOrderErrorMessage(
                        "本日以降の日にちを指定してください"
                      );
                      setDateisCorrext(false);
                    } else {
                      setOrderErrorMessage("");
                      handleTodayDate();
                      setDateisCorrext(true);
                    }
                    const deliveryDate = format(
                      new Date(e.target.value),
                      "yyyy-MM-dd"
                    );
                    return {
                      ...userStatus?.userInfo,
                      deliveryDate: deliveryDate,
                    };
                  })
                }
              />
            </div>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="10"
                name="radio-buttons-group"
              >
                {deliveryHourArr.map((time: number, index: number) => (
                  <FormControlLabel
                    // 一意なvalueを与えないとチェックが入らない
                    value={time.toString()}
                    key={index}
                    control={
                      <Radio
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          userStatus?.setUserInfo(() => {
                            const todaysHour = today.getHours();
                            const selectedHour = Number(e.target.value);

                            if (dateisCorrect && selectedHour < todaysHour) {
                              setOrderErrorMessage(
                                "正しい時間を指定してください"
                              );
                            } else {
                              setOrderErrorMessage("");
                              setHandleOrderButton(false);
                            }
                            return {
                              ...userStatus?.userInfo,
                              deliveryHour: Number(e.target.value),
                            };
                          })
                        }
                        required
                      />
                    }
                    label={time + "時"}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
          <div className="form">
            <h2>---お支払方法---</h2>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="1"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="1"
                  control={
                    <Radio
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        userStatus?.setUserInfo({
                          ...userStatus?.userInfo,
                          paymentMethod: Number(e.target.value),
                        })
                      }
                    />
                  }
                  label="代金引換"
                />
                <FormControlLabel
                  value="2"
                  control={
                    <Radio
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        userStatus?.setUserInfo({
                          ...userStatus?.userInfo,
                          paymentMethod: Number(e.target.value),
                        })
                      }
                    />
                  }
                  label="クレジットカード"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="orderButton">
            <div>{orderErrorMessage}</div>
            <Button
              type="button"
              variant="contained"
              onClick={order}
              disabled={handleOrderButton}
            >
              この内容で注文する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
