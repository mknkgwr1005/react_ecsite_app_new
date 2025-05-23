import { Container, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "../css/loading.css";
import { NoOrderHistory } from "../components/NoOrderHistory";

type loadingType = {
  noOrderHistory: boolean;
};

export const Loading = ({ noOrderHistory }: loadingType) => {
  return (
    <Container>
      {!noOrderHistory ? (
        <Box className="box">
          <div>少々お待ちください・・・。</div>
          <CircularProgress />
        </Box>
      ) : (
        <NoOrderHistory />
      )}
    </Container>
  );
};
