import React, { useContext } from "react";
import { statusContext } from "./providers/statusContext";
import Button from "@material-ui/core/Button";
import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../components/providers/UserInfoContext";
import { auth } from "../app/index";
import { registerInfoContext } from "./Register/RegisterInfo";
import { registerUserNameContext } from "./Register/RegisterUserName";

export const StatusButton: React.VFC = () => {
  //ユーザーが入力した情報
  const userStatus = useContext(userContext);
  // ユーザー情報
  const changeStatus = useContext(statusContext);

  // ナビゲート機能
  const navigate = useNavigate();

  // ログイン状態確認
  const loginStatus = auth.onAuthStateChanged((user) => {
    if (user) {
      changeStatus?.setstatusCheck(true);
    } else {
      changeStatus?.setstatusCheck(false);
    }
  });

  const pathname = useLocation().pathname;
  const userData = useContext(registerInfoContext);
  const userName = useContext(registerUserNameContext);

  const clearUserInfo = () => {
    // 入力欄を更新
    userStatus?.setUserInfo({
      ...userStatus?.userInfo,
      name: { lastName: "", firstName: "" },
      mailAddress: "",
      zipCode: 0,
      address: "",
      telephone: 0,
    });
    if (pathname !== "/RegisterUser") {
      userData?.setregisterData({
        id: "",
        name: { lastName: "", firstName: "" },
        mailAddress: "",
        password: "",
        zipcode: "",
        address: "",
        telephone: "",
      });
      userName?.setregisterName({
        lastName: "",
        firstName: "",
      });
    } else return;
  };

  // ログアウトメソッド
  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        alert("ログアウトしました");
        changeStatus?.setstatusCheck(false);
        loginStatus();
        clearUserInfo();
      })
      .catch((error) => {
        alert("ログアウトに失敗しました");
        // An error happened.
      });
  };
  const handleSignOut = () => {
    if (loginStatus !== null) {
      logout();
      changeStatus?.setstatusCheck(false);
      navigate("/");
    } else {
      return;
    }
  };

  const handleSignIn = () => {
    loginStatus();
    navigate("/login");
  };

  return (
    <React.Fragment>
      {changeStatus?.statusCheck ? (
        <Button color="inherit" onClick={handleSignOut}>
          ログアウト
        </Button>
      ) : (
        <Button
          color="inherit"
          onClick={handleSignIn}
          onChange={() => {
            handleSignIn();
          }}
        >
          ログイン
        </Button>
      )}
    </React.Fragment>
  );
};
