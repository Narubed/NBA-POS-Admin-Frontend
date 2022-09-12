import * as React from "react";
import Iconify from "@/components/Iconify";
import MenuPopover from "@/components/MenuPopover";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
  Fade,
  Menu,
  Button,
} from "@mui/material";

import account from "./_mock/account";
import { useRouter } from "next/router";

export default function FadeMenu() {
  const router = useRouter();
  const { currentUser, logout } = useCurrentUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser?.admin_name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {currentUser?.admin_email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            router.push("/auth/admin");
          }}
          sx={{
            m: 1,
            borderRadius: "15px",
            ":hover": {
              bgcolor: "purple",
              color: "#FFFFFF",
            },
          }}
        >
          จัดการผู้ดูแลระบบ
        </MenuItem>
        {/*   <MenuItem
          onClick={handleClose}
          sx={{
            m: 1,
            borderRadius: "15px",
            ":hover": {
              bgcolor: "purple",
              color: "#FFFFFF",
            },
          }}
        >
          My accdasdasdasount
        </MenuItem>
       <MenuItem
          onClick={handleClose}
          sx={{
            m: 1,
            borderRadius: "15px",
            ":hover": {
              bgcolor: "purple",
              color: "#FFFFFF",
            },
          }}
        >
          Logoutdasdasdsd
        </MenuItem> */}
        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={logout}
          sx={{
            m: 1,
            borderRadius: "15px",
            ":hover": {
              bgcolor: "purple",
              color: "#FFFFFF",
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
