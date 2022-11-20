/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import SessionBar from "@/components/layouts/reusable/SessionSubBar";
import { useRouter } from "next/router";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import {
  Stack,
  TextField,
  Container,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Form,
  Button,
  ListItem,
  InputAdornment,
  Grid,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export default function edit() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  console.log(currentUser);
  const router = useRouter();
  const { query } = router;
  const [values, setValues] = useState({
    owner_name: "",
    owner_email: "",
    owner_password: "",
    owner_phone: "",
    owner_address: "",
    owner_status: true,
    owner_date_start: Date.now(),
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataPOST = {
      owner_name: values.owner_name,
      owner_email: values.owner_email,
      owner_password: values.owner_password,
      owner_phone: values.owner_phone,
      owner_address: values.owner_address,
      owner_status: values.owner_status,
      owner_date_start: dayjs(values.owner_date_start).format(),
    };
    Swal.fire({
      title: "ยืนยันการเพิ่ม?",
      text: "คุณต้องการเพิ่มผู้ใช้นี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/owners`;
        // fetcherWithToken(url).then((json) => {
        //   setValues(json.data);
        // });

        await fetcherWithToken(url, {
          method: "POST",
          body: JSON.stringify(dataPOST),
        })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "ยืนยันการเพิ่ม",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              router.push("/auth/owner");
            }, 1500);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถเพิ่มผู้ใช้ได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const onChangeSwitchStatus = async (event) => {
    setValues({ ...values, owner_status: event.target.checked });
  };

  return (
    <SessionBar>
      {currentUser ? (
        <Container>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                height: "100%",
              }}
            >
              <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItem disablePadding>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="owner_name">
                        ชื่อเจ้าของกิจการ
                      </InputLabel>
                      <Input
                        id="owner_name"
                        value={values.owner_name}
                        onChange={handleChange("owner_name")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="bxs:user-rectangle" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="owner_phone">
                        เบอร์โทรศัพท์
                      </InputLabel>
                      <Input
                        id="owner_phone"
                        value={values.owner_phone}
                        onChange={handleChange("owner_phone")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="bxs:phone-call" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </ListItem>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItem disablePadding>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="owner_name">
                        อีเมล/ใช้เข้าสู่ระบบ
                      </InputLabel>
                      <Input
                        id="owner_email"
                        value={values.owner_email}
                        onChange={handleChange("owner_email")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="emojione:e-mail" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </ListItem>
                  <ListItem disablePadding>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="owner_password">รหัสผ่าน</InputLabel>
                      <Input
                        id="owner_password"
                        value={values.owner_password}
                        onChange={handleChange("owner_password")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="emojione:locked-with-key" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </ListItem>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItem disablePadding>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="owner_address">ที่อยู่</InputLabel>
                      <Input
                        id="owner_address"
                        value={values.owner_address}
                        onChange={handleChange("owner_address")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="clarity:map-marker-solid-badged" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </ListItem>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                      label="วันที่เริ่ม"
                      value={values.owner_date_start}
                      defaultValue={values.owner_date_start}
                      onChange={(newValue) => {
                        setValues({
                          ...values,
                          owner_date_start: dayjs(newValue).format(),
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          fullWidth
                          sx={{ m: 1 }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                <FormControlLabel
                  control={<Switch checked={values.owner_status} />}
                  defaultValue={values.owner_status}
                  label={values.owner_status ? "ออนไลน์" : "ออฟไลน์"}
                  onChange={(e) => onChangeSwitchStatus(e)}
                />
              </Grid>
              <LoadingButton fullWidth variant="contained" type="submit">
                ยืนยัน
              </LoadingButton>
            </Box>
          </form>
        </Container>
      ) : (
        <a>loading...</a>
      )}
    </SessionBar>
  );
}
