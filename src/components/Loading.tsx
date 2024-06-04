import { Container } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import "../css/loading.css";
import { Box } from "@material-ui/core";

export const Loading = () => {
  return (
    <Container>
      <Box className="box">
        <div>少々お待ちください・・・。</div>
        <CircularProgress />
      </Box>
    </Container>
  );
};
