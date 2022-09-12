// @mui
import { styled } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";

import { LoginForm } from "../sections/auth/login";
import useCurrentUser from "@/lib/hook/useCurrentUser";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 560,
  margin: "auto",
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { fetcherWithToken, currentUser } = useCurrentUser();

  return (
    <RootStyle>
      <HeaderStyle>เอาไว้ใส่โลโก้</HeaderStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Typography variant="h4" gutterBottom>
            ยินดีต้อนรับสู่
          </Typography>

          <Typography sx={{ color: "text.secondary", mb: 5 }}>
            ระบบจัดการข้อมูล POS.
          </Typography>

          {/* <AuthSocial /> */}

          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
