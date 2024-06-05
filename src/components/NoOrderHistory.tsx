import { Container, Box, Button } from "@mui/material";
import "../css/noOrderHistory.css";
import { useNavigate } from "react-router-dom";
export const NoOrderHistory = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box className="box">
        <div>注文履歴がありません！お買い物をお楽しみください</div>
        <Button onClick={() => navigate("/itemList")} color="primary">
          お買い物に戻る
        </Button>
      </Box>
    </Container>
  );
};
