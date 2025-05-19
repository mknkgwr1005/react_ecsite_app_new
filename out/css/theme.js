"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
const styles_1 = require("@mui/material/styles");
require("../index.css");
// フォントを設定
const fontFamily = [
  "Kaisei Decol",
  "Hachi Maru Pop",
  "Yusei Magic",
  "Noto Sans JP",
  "sans-serif",
  // 使用したいフォントを以降に羅列してください
].join(",");
exports.theme = (0, styles_1.createTheme)({
  typography: {
    fontFamily: "Kaisei Decol",
    fontWeightLight: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      main: "#009688",
      contrastText: "#795548",
    },
    background: {
      default: "#FFEBCD",
    },
    text: { primary: "#663300" },
  },
  shape: {
    borderRadius: 40,
  },
});
