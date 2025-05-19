import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Card, CardMedia, Grid, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import "../css/header.css";
import "../css/toppage.css";

export const Toppage = () => {
  const navigate = useNavigate();
  // 参考サイト
  // http://www.salvatore.jp/restaurant/daikanyama/

  return (
    <div>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <h1 className="toppageTitle">Enjoy our Delicious Pizza</h1>

        <Grid
          className="example"
          container
          justifyContent="center"
          alignItems="flex-start"
        >
          <CardMedia
            component="img"
            height="500"
            src="../img_pizza/pizza_toppage.png"
          />

          <button className="loginbotan" onClick={() => navigate("/login")}>
            ログインする
          </button>
          <button
            className="registerbotan"
            onClick={() => navigate("/registerUser")}
          >
            会員登録する
          </button>
        </Grid>

        <br></br>

        {/* CTRをまとめたセクション */}
        <table className="tablebtn">
          {/* <tr>
            <td align="center">
              <Button
                className="btn"
                style={{ color: "#e0f2f1", backgroundColor: "#004d40" }}
                variant="contained"
                onClick={() => navigate("/login")}
              >
                ログインする
              </Button>
            </td>
            <td align="center">
              <Button
                className="btn"
                style={{ color: "#e0f2f1", backgroundColor: "#004d40" }}
                variant="contained"
                onClick={() => navigate("/registerUser")}
              >
                会員登録する
              </Button>
            </td>
          </tr> */}
          <tr>
            <td colSpan={2} align="center">
              <h2>
                <span>まずはここから商品をチェック</span>
              </h2>
            </td>
          </tr>
          <tr>
            <td align="center">
              <Button
                className="btn"
                style={{ color: "#e0f2f1", backgroundColor: "#004d40" }}
                variant="contained"
                onClick={() => navigate("/itemList")}
              >
                フードメニューを見る
              </Button>
            </td>
            <td align="center">
              <Button
                className="btn"
                style={{ color: "#e0f2f1", backgroundColor: "#004d40" }}
                variant="contained"
                onClick={() => navigate("/itemList")}
              >
                デリバリーメニューを見る
              </Button>
            </td>
          </tr>
          <tr>.</tr>
        </table>

        {/* 創業者をPRするセクション */}
        <Card>
          <table>
            <tr>
              <th rowSpan={2}>
                {" "}
                <img src="../italianMan.png" alt="" width="200" />
              </th>

              <td>
                {" "}
                <Typography variant="h5">
                  ナポリピッツァを日本に広めた功労者 <br></br>
                  サルヴァトーレ・クオモがプロデュースするピッツェリア
                </Typography>
              </td>
            </tr>

            <tr>
              <td>
                {" "}
                <Typography variant="h6">
                  イタリアの窯職人が作ったピッツァ窯の中で焼き上げるナポリピッツァは、薄生地なのにもちもちで、薪のかおりが香ばしい逸品です。
                  ご家族、仲間同士のディナーやパーティに、わいわい楽しくイタリアンスタイルでお楽しみ下さい。
                </Typography>
              </td>
            </tr>
          </table>
        </Card>
        <br></br>

        {/* 住所、問い合わせ先とバナーを合わせたセクション */}
        <table>
          <tr>.</tr>
          <tr>
            <td colSpan={2}>〒150-0032 東京都渋谷区鶯谷町19-19 第三叶ビル1F</td>
            <td rowSpan={2}>
              {" "}
              <img src="../banner1.png" alt="" width="350" />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              {" "}
              東急東横線「代官山駅」から徒歩約10分
              <br />
              JR線「渋谷駅」南口から徒歩約10分
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="h6">
                {" "}
                <PhoneIcon />
                ご予約お問い合わせ
              </Typography>
            </td>
            <td>
              <Typography variant="h6">03-1234-5678&nbsp;&nbsp;</Typography>
            </td>
            <td rowSpan={2}>
              {" "}
              <img src="../banner2.png" alt="" width="350" />
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="h6">
                {" "}
                <PhoneIcon />
                デリバリー専用ダイアル
              </Typography>
            </td>
            <td>
              <Typography variant="h6">03-9876-5432&nbsp;&nbsp;</Typography>
            </td>
          </tr>
          <tr>.</tr>
        </table>
        {/* デリバリーなら大徳というプロモーションバナー */}
        <img src="../promotion.png" alt="" width="70%" />
      </Grid>
    </div>
  );
};
