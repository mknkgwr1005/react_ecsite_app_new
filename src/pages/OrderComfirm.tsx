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
} from "@mui/material";
import { userContext } from "../components/providers/UserInfoContext";
import { FirebaseTimestamp, auth, db } from "../app/index";
import { cartListContext } from "../components/providers/CartListProvider";

export const OrderConfirm: FC = () => {
  const currentUser = auth.currentUser;
  const currentUserUid = currentUser?.uid;

  const navigate = useNavigate();
  const totalPrice = useTotalPrice();
  const userStatus = useContext(userContext);
  const orderItem = useContext(cartListContext);

  const deliveryHourArr = [10, 11, 12, 13, 14, 15, 16, 17, 18];
  const [deliveryTime, setDeliveryTime] = useState("");
  const [today, setToday] = useState(new Date());
  const [dateIsCorrect, setDateIsCorrect] = useState(false);
  const [timeIsCorrect, setTimeIsCorrect] = useState(false);
  const [handleOrderButton, setHandleOrderButton] = useState(true);
  const [itIsToday, setItIsToday] = useState(false);
  const [orderErrorMessage, setOrderErrorMessage] = useState("");

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

  useEffect(() => {
    if (dateIsCorrect && timeIsCorrect && userStatus) {
      setHandleOrderButton(false);
    } else {
      setHandleOrderButton(true);
    }
  }, [dateIsCorrect, userStatus, timeIsCorrect]);

  const setTodaysHour = () => {
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
  };

  const handleTodayDate = () => {
    setToday(new Date());
  };

  const handleButton = (selectedHour: number) => {
    handleTodayDate();
    const todaysHour = today.getHours();
    if (
      (dateIsCorrect && !itIsToday) ||
      (itIsToday && selectedHour > todaysHour)
    ) {
      setTimeIsCorrect(true);
      setOrderErrorMessage("");
    } else if (itIsToday && dateIsCorrect && selectedHour < todaysHour) {
      setOrderErrorMessage("正しい時間を指定してください");
      setTimeIsCorrect(false);
    } else {
      setOrderErrorMessage("正しい時間を指定してください");
      setTimeIsCorrect(false);
    }
  };

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
        orderItemFormList: orderItem?.cartList,
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

  const autoComplete = async () => {
    const userInfoRef = db.collection("userInformation");

    const currentUserData = (
      await userInfoRef.doc(currentUserUid).get()
    ).data();

    const inputUserName = currentUserData?.name;
    const inputUserEmail = currentUserData?.email;
    const inputUserZipCode = currentUserData?.zipcode;
    const inputUserAddress = currentUserData?.address;
    const inputUserTelephone = currentUserData?.telephone;

    const stringZipCode = String(inputUserZipCode);
    const formatZipCode = stringZipCode.replace("-", "");
    const numberZipCode = Number(formatZipCode);

    userStatus?.setUserInfo({
      ...userStatus?.userInfo,
      name: inputUserName,
      mailAddress: inputUserEmail,
      zipCode: numberZipCode,
      address: inputUserAddress,
      telephone: inputUserTelephone,
    });
  };

  const setUserName = (lastNameData?: string, firstNameData?: string) => {
    userStatus?.setUserInfo({
      ...userStatus.userInfo,
      name: { lastName: lastNameData, firstName: firstNameData },
    });
  };

  return (
    <div className="orderConfirm">
      <div className="context">
        <CartListTable hasButton={false} />
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
                onChange={(e) =>
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
              onChange={(e) =>
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
                variant="outlined"
                id="deliveryDate"
                type="date"
                onChange={(e) => {
                  setTodaysHour();
                  const selectedDate = new Date(e.target.value);
                  if (selectedDate < today) {
                    setOrderErrorMessage("本日以降の日にちを指定してください");
                    setDateIsCorrect(false);
                    setItIsToday(false);
                  } else if (
                    selectedDate.getFullYear() === today.getFullYear() &&
                    selectedDate.getMonth() === today.getMonth() &&
                    selectedDate.getDate() === today.getDate()
                  ) {
                    setOrderErrorMessage("");
                    setItIsToday(true);
                    setDateIsCorrect(true);
                  } else {
                    setOrderErrorMessage("");
                    handleTodayDate();
                    setDateIsCorrect(true);
                    setItIsToday(false);
                  }
                  const deliveryDate = format(
                    new Date(e.target.value),
                    "yyyy-MM-dd"
                  );
                  userStatus?.setUserInfo({
                    ...userStatus?.userInfo,
                    deliveryDate: deliveryDate,
                  });
                }}
              />
            </div>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="10"
                name="radio-buttons-group"
              >
                {deliveryHourArr.map((time, index) => (
                  <FormControlLabel
                    value={time.toString()}
                    key={index}
                    control={
                      <Radio
                        onChange={(e) => {
                          const selectedHour = Number(e.target.value);
                          handleButton(selectedHour);
                          userStatus?.setUserInfo({
                            ...userStatus?.userInfo,
                            deliveryHour: selectedHour,
                          });
                        }}
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
                      onChange={(e) =>
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
                      onChange={(e) =>
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
