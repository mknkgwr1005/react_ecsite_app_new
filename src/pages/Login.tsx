/* eslint-disable no-lone-blocks */
import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputLogin } from "../components/inputLogin";
import Button from "@material-ui/core/Button";
import { statusContext } from "../components/providers/statusContext";
import { app } from "../app/config";
import "firebase/auth";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/auth";
import { TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { Box, Grid, Input, Typography } from "@material-ui/core";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";

// useEffectを使ったログイン機能;
export const Login = () => {
  const navigate = useNavigate();

  const [loginErrorMessage, setloginErrorMessage] = useState("");
  const [mailAddress, setmailAddress] = useState("");
  const [password, setpassword] = useState("");
  const auth = useContext(statusContext);

  const submitLogin = async () => {
    console.log(mailAddress, password);
    setloginErrorMessage(() => "");
    const response = await axios.post(
      "http://153.127.48.168:8080/ecsite-api/user/login",
      { mailAddress: mailAddress, password: password }
    );
    const status = response.data.status;
    console.dir("responce:" + JSON.stringify(response));
    if (status === "success") {
      console.log("成功");
      auth?.setstatusCheck(true);
      navigate("/ItemList");
    } else if (status === "error") {
      alert("メールアドレス、またはパスワードが間違っています");
    } else {
      alert("メールアドレス、パスワードを記入してください");
    }
  };

  // firebase認証
  const authrization = getAuth(app);
  // ツイッター認証
  const providerTwitter = new TwitterAuthProvider();

  /**
   * ツイッターでのログイン
   */
  const loginWithTwitter = () => {
    getRedirectResult(authrization);

    // signInWithEmailAndPassword(authrization, "test@email.com", "testForNow");
    // signInWithRedirect(authrization, providerTwitter);

    signInWithPopup(authrization, providerTwitter)
      .then((result) => {
        if (result.operationType === "signIn") {
          console.log("twitterログイン成功");
          auth?.setstatusCheck(true);
          navigate("/ItemList");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        alert(
          `"Twitterでログインできませんでした。"+"エラーメッセージ："+${errorMessage}`
        );
      });
  };

  // facebook認証
  const providerFacebook = new FacebookAuthProvider();

  const loginWithFacebook = () => {
    signInWithPopup(authrization, providerFacebook)
      .then((result) => {
        if (result.operationType === "signIn") {
          console.log("twitterログイン成功");
          auth?.setstatusCheck(true);
          navigate("/ItemList");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        alert(
          `"Twitterでログインできませんでした。"+"エラーメッセージ："+${errorMessage}`
        );
      });
  };

  return (
    <div>
      <div className="top-wrapper">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid container justifyContent="center" alignItems="flex-start">
            <h1>ログイン画面</h1>
          </Grid>
          <span className="container">
            <form>
              <label htmlFor="mailAddress">
                <EmailIcon />
              </label>
              <Input
                type="text"
                className="mailAddress"
                id="mailAddress"
                onChange={(event) => setmailAddress(() => event.target.value)}
              />
              <br></br>
              <label htmlFor="password">
                <LockIcon />
              </label>
              <Input
                type="text"
                className="password"
                id="password"
                onChange={(event) => setpassword(() => event.target.value)}
              />
              <div className="row login-btn">
                <Button
                  className="btn"
                  style={{ fontWeight: 700 }}
                  onClick={submitLogin}
                >
                  ログインする
                </Button>
                <Button
                  className="btn"
                  style={{ fontWeight: 700 }}
                  onClick={() => navigate("/registerUser")}
                >
                  まずはユーザー登録
                </Button>
                <button type="button" onClick={loginWithTwitter}>
                  Twitterでログインする
                </button>
                <button type="button" onClick={loginWithFacebook}>
                  Facebookでログインする
                </button>
              </div>
            </form>
          </span>
        </Grid>
      </div>{" "}
    </div>
  );
};

// export function Login() {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const navigate = useNavigate();

//   return (
//     <div>
//       <h3>ログイン画面</h3>
//       {/* 入力フォームのimport */}
//       {/* <InputLogin /> */}
//       {/* ログイン切り替えボタンのimport */}
//       <StatusButton />

//       <button className="btn" onClick={() => navigate("/content")}>
//         ユーザー登録
//       </button>

//       <div>
//         <Button color="inherit" onClick={() => navigate("/")}>
//           Topページに戻る
//         </Button>
//       </div>
//     </div>
//   );
// }
