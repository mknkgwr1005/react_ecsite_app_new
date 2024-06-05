import React from "react";
import { Box, Button, Divider, FormControl, TextField } from "@mui/material";
import axios from "axios";
import { app } from "../app/config";
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/questionForm.css";
import Stack from "@mui/material/Stack";
import { theme } from "../css/theme";

export const QuestionForm = () => {
  const navigate = useNavigate();

  // firestore認証
  const db = getFirestore(app);
  const docRef = collection(db, "questionForm");

  //   ユーザー情報
  const [userName, setUserName] = useState("");
  const [userMailAddress, setUserMailAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [disable, setDisable] = useState(true);

  const handleDisable = () => {
    if (
      userName !== "" &&
      userMailAddress !== "" &&
      message !== "" &&
      message !== "質問内容を入力してください"
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };

  //   ユーザー情報をfirebaseに送る
  const sendUserInfo = async () => {
    try {
      await addDoc(docRef, {
        name: userName,
        mailaddress: userMailAddress,
        userId: userId,
        message: message,
        Date: new Date(),
      });
      navigate("/QuestionCompleted");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDisable();
  }, [userName, userMailAddress, message]);

  return (
    <Box sx={{ typography: "Kaisei Decol" }}>
      <Stack
        spacing={5}
        direction={"column"}
        margin={"20px"}
        className="container"
      >
        <div id="title">お問い合わせ</div>
        <TextField
          required
          id="outlined-required"
          label="お名前"
          variant="outlined"
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="メールアドレス"
          variant="outlined"
          onChange={(e) => setUserMailAddress(e.target.value)}
        />
        <TextField
          id="outlined-required"
          label="ユーザーID"
          variant="outlined"
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          required
          id="outlined-multiline-static"
          label="お問い合わせ内容"
          variant="outlined"
          multiline
          rows={10}
          defaultValue={"質問内容を入力してください"}
          onChange={(e) => setMessage(e.target.value)}
        />
        <br />
        <Button
          onClick={sendUserInfo}
          disabled={disable}
          variant="contained"
          color="primary"
        >
          送信
        </Button>
      </Stack>
    </Box>
  );
};
