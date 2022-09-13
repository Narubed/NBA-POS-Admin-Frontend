/* eslint-disable camelcase */
import { Icon } from "@iconify/react";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

// ----------------------------------------------------------------------
CheckOrderMoreMenu.propTypes = {
  id: PropTypes.string,
  order_partner_total: PropTypes.number,
  order_partner_status: PropTypes.string,
};

export default function CheckOrderMoreMenu({ row, fetcherOwners }) {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const router = useRouter();

  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const deleteBranch = () => {
    setIsOpen(false);
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบสาขานี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/branch/${row._id}`;
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
              fetcherOwners();
            }, 1500);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถลบข้อมูลผสาขานี้ได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const showEdit = async () => {
    router.push({
      pathname: "/auth/branch/edit/[id]",
      query: { id: row._id },
    });
  };

  return (
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
            <Icon icon="ooui:recent-changes-ltr" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="แก้ไข"
            primaryTypographyProps={{ variant: "body2" }}
            onClick={() => showEdit()}
          />
        </MenuItem>
        <MenuItem sx={{ color: "text.secondary" }}>
          <ListItemIcon>
            <Icon icon="dashicons:table-row-delete" width={24} height={24} />
          </ListItemIcon>
          <ListItemText
            primary="ลบสาขา"
            primaryTypographyProps={{ variant: "body2" }}
            onClick={() => deleteBranch()}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
