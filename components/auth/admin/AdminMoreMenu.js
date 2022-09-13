/* eslint-disable camelcase */
import { Icon } from "@iconify/react";
import Link from "next/link";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import "dayjs/locale/th";

// material-tailwind

// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

import DialogChangePassword from "./DialogChangePassword";
import DialogEditAdmin from "./DialogEditAdmin";

// ----------------------------------------------------------------------
AdminMoreMenu.propTypes = {
  id: PropTypes.string,
  order_partner_total: PropTypes.number,
  order_partner_status: PropTypes.string,
};

export default function AdminMoreMenu({ row, fetcherAdmin }) {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const router = useRouter();
  const [isDialogPassword, setDialogPassword] = React.useState(false);
  const [isOpenDialog, setOpenDialog] = React.useState(false);

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteOwner = () => {
    setIsOpen(false);
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบผู้ดูแลนี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/admins/${row._id}`;
        await fetcherWithToken(url, {
          method: "DELETE",
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "ยืนยันการลบ",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              fetcherAdmin();
            }, 1500);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถลบข้อมูลผู้ใช้ได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const showEdit = async () => {
    setOpenDialog(true);
    setIsOpen(false);
  };

  const changePassword = async () => {
    setDialogPassword(true);
    setIsOpen(false);
  };

  return (
    <>
      <DialogEditAdmin
        row={row}
        setOpenDialog={setOpenDialog}
        isOpenDialog={isOpenDialog}
        fetcherAdmin={fetcherAdmin}
      />
      <>
        <IconButton ref={ref} onClick={() => setIsOpen(true)}>
          <Icon icon="ic:round-filter-list" />
        </IconButton>

        <Menu
          open={isOpen}
          anchorEl={ref.current}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: { width: 200, maxWidth: "100%" },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon icon="bxs:edit-location" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
              primary="แก้ไข"
              primaryTypographyProps={{ variant: "body2" }}
              onClick={() => showEdit()}
            />
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon
                icon="icon-park-outline:people-delete"
                width={24}
                height={24}
              />
            </ListItemIcon>
            <ListItemText
              primary="ลบผู้ใช้งาน"
              primaryTypographyProps={{ variant: "body2" }}
              onClick={() => deleteOwner()}
            />
          </MenuItem>
          <MenuItem sx={{ color: "text.secondary" }}>
            <ListItemIcon>
              <Icon
                icon="icon-park-outline:view-grid-detail"
                width={24}
                height={24}
              />
            </ListItemIcon>
            <ListItemText
              primary="แก้ไขรหัสผ่าน"
              primaryTypographyProps={{ variant: "body2" }}
              onClick={() => changePassword()}
            />
          </MenuItem>
        </Menu>
        <DialogChangePassword
          isDialogPassword={isDialogPassword}
          setDialogPassword={setDialogPassword}
          row={row}
        />
      </>
    </>
  );
}
