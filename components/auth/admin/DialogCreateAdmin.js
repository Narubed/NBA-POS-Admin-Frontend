import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  InputAdornment,
  AuthChangePassword,
  Box,
  AnimateButton,
  TextField,
} from "@mui/material";
import numeral from "numeral";
import Swal from "sweetalert2";
import useCurrentUser from "@/lib/hook/useCurrentUser";

// third party
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";
import axios from "axios";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCreateInvoice({
  isOpenDialogCreate,
  setOpenDialogCreate,
  fetcherAdmin,
}) {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [isValues, setValues] = React.useState();
  const [isOpenDialogConfirm, setOpenDialogConfirm] = React.useState(false);

  const handleSubmits = async (e) => {
    console.log(e);
    setValues(e);
    setOpenDialogCreate(false);
    setOpenDialogConfirm(true);
  };

  const RegisterSchema = Yup.object().shape({
    admin_email: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("กรุณากรอกอีเมล"),
    admin_name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("กรุณากรอกชื่อ"),
    admin_password: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("กรุณากรอกรหัสผ่าน"),
  });

  const formik = useFormik({
    initialValues: {
      admin_email: "",
      admin_name: "",
      admin_password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e),
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const headleConfirm = async () => {
    setOpenDialogConfirm(false);
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/admins`;
    await fetcherWithToken(url, {
      method: "POST",
      body: JSON.stringify({
        admin_email: isValues.admin_email,
        admin_name: isValues.admin_name,
        admin_password: isValues.admin_password,
        admin_date_start: dayjs(Date.now()).format(),
      }),
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "ยืนยันการเพิ่ม",
          showConfirmButton: false,
          timer: 1500,
        });
        fetcherAdmin();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถเพิ่มข้อมูลผู้ใช้ได้",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  return (
    <>
      {" "}
      <Dialog
        fullWidth
        open={isOpenDialogCreate}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"กรุณากรอกรายละเอียดของผู้ดูแลระบบ!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ mt: 5 }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <TextField
                      fullWidth
                      label="อีเมล"
                      {...getFieldProps("admin_email")}
                      error={Boolean(touched.admin_email && errors.admin_email)}
                      helperText={touched.admin_email && errors.admin_email}
                    />
                    <TextField
                      fullWidth
                      label="ชื่อผู้ดูแล"
                      {...getFieldProps("admin_name")}
                      error={Boolean(touched.admin_name && errors.admin_name)}
                      helperText={touched.admin_name && errors.admin_name}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    label="รหัสผ่าน"
                    {...getFieldProps("admin_password")}
                    error={Boolean(
                      touched.admin_password && errors.admin_password
                    )}
                    helperText={touched.admin_password && errors.admin_password}
                  />
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  sx={{ mt: 5 }}
                >
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    ยืนยัน
                  </Button>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="error"
                    onClick={() => setOpenDialog(false)}
                  >
                    ยกเลิก
                  </Button>
                </Stack>
              </Form>
            </FormikProvider>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth
        open={isOpenDialogConfirm}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialogConfirm(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"ยืนยันข้อมูลก่อนยืนยันการแก้ไขผู้ดูแลระบบ"}</DialogTitle>
        <DialogActions>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={headleConfirm}
          >
            ยืนยัน
          </Button>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="error"
            onClick={() => setOpenDialogConfirm(false)}
          >
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
