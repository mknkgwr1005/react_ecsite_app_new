import React from "react";
// v5では @mui/material に変更
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import "../css/errorPage.css";

export const ErrorPage = () => {
  return (
    <div>
      <br />
      <Grid container justifyContent="center" alignItems="flex-start">
        <span className="errorImage">
          <br />
        </span>
        <span className="errorMessage">
          <p>404エラー </p>
          <p>申し訳ありません、ページが見つかりませんでした…</p>
          <br />
          <img
            className="hedgehog"
            src="img/error_image.png"
            alt="test"
            style={{
              width: "300px",
              height: "300px",
            }}
          />
        </span>
      </Grid>
    </div>
  );
};
