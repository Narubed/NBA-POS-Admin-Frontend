import * as React from "react";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";

export default function FormDialog({
  isDialogPassword,
  setDialogPassword,
  row,
}) {
  const { fetcherWithToken, currentUser } = useCurrentUser();

  const [newPassword, setPassword] = React.useState("");
  const handleClose = () => {
    setPassword("");
    setDialogPassword(false);
  };
  const confirmPassword = async () => {
    setDialogPassword(false);

    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/owners/${row._id}`;
    await fetcherWithToken(url, {
      method: "PUT",
      body: JSON.stringify({ owner_password: newPassword }),
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "ยืนยันการแก้ไขรหัสผ่าน",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถลบข้อมูลผู้ใช้ได้",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <div>
      <Dialog open={isDialogPassword} onClose={handleClose}>
        <DialogTitle>{row.owner_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* <a> เบอร์ : {row.owner_phone}</a> */}
            <br />
            <a> ที่อยู่ : {row.owner_address}</a>
            <br />
          </DialogContentText>
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="รหัสผ่านใหม่"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            ยกเลิก
          </Button>
          <Button onClick={confirmPassword}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
