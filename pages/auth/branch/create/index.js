/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import SessionBar from "@/components/layouts/reusable/SessionSubBar";
import { useRouter } from "next/router";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { LoadingButton } from "@mui/lab";
import { useSelector, useDispatch } from "react-redux";
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
  Autocomplete,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import imagesicon from "../../../../public/images/NoImage.png";
import headleSubmit from "@/components/auth/branch/create/headleSubmit";

const ImgStyled = styled("img")(({ theme }) => ({
  width: "20%",
  height: "20%",
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginLeft: 0,
    textAlign: "center",
    marginTop: theme.spacing(4),
  },
}));

export default function edit() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const token = useSelector((state) => state.session.token);
  const router = useRouter();
  const { query } = router;
  const [isOwners, setOwners] = useState([]);
  const [isSelectedOwner, setSelectedOwner] = useState();

  const [values, setValues] = useState({
    branch_name: "",
    branch_status: true,
    branch_image: "ไม่มี",
    branch_phone: "",
    branch_status_vat: false,
    branch_vat_name: "",
    branch_vat_number: "ไม่มี",
    branch_vat_address: "",
    branch_date_end: "",
  });

  useEffect(() => {
    if (currentUser) {
      const urlOwner = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/owners`;
      fetcherWithToken(urlOwner)
        .then((json) => {
          setOwners(json.data);
        })
        .catch(() => setOwners([]));
    }
  }, [currentUser]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      file.length === 0 ||
      !isSelectedOwner ||
      !values ||
      !values.branch_name ||
      !values.branch_image ||
      !values.branch_phone ||
      !values.branch_vat_address
    ) {
      Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      await headleSubmit({
        values,
        file,
        query,
        fetcherWithToken,
        router,
        token,
        isSelectedOwner,
      });
    }
  };

  const onChangeSwitchStatus = async (event) => {
    setValues({ ...values, branch_status: event.target.checked });
  };

  const onChangeSwitchStatusVat = async (event) => {
    setValues({ ...values, branch_status_vat: event.target.checked });
  };

  const [imgSrc, setImgSrc] = useState(null);
  const [file, setfile] = useState([]);

  const onChange = (file) => {
    const reader = new FileReader();
    const { files } = file.target;
    if (files && files.length !== 0) {
      setfile(files[0]);
      reader.onload = () => setImgSrc(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const resetImage = async () => {
    setfile([]);
    setImgSrc(imagesicon.src);
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
                  {file.length === 0 ? (
                    values.branch_image === "ไม่มี" ? (
                      <ImgStyled src={imagesicon.src} alt={imagesicon.src} />
                    ) : (
                      <ImgStyled
                        src={`${process.env.NEXT_PUBLIC_DRIVE_SELECT_IMAGE}${values.branch_image}`}
                        alt={`${process.env.NEXT_PUBLIC_DRIVE_SELECT_IMAGE}${values.branch_image}`}
                      />
                    )
                  ) : (
                    <ImgStyled src={imgSrc} alt="Profile Pic" />
                  )}

                  <Box>
                    <ButtonStyled
                      component="label"
                      variant="contained"
                      htmlFor="account-settings-upload-image"
                    >
                      เปลี่ยนรูปภาพที่แสดง
                      <input
                        hidden
                        type="file"
                        onChange={onChange}
                        accept="image/png, image/jpeg"
                        id="account-settings-upload-image"
                      />
                    </ButtonStyled>
                    <ResetButtonStyled
                      color="error"
                      variant="outlined"
                      onClick={() => resetImage()}
                    >
                      Reset
                    </ResetButtonStyled>
                    <Typography variant="body2" sx={{ marginTop: 5 }}>
                      แนะนำให้เป็นไฟล์ png หรือ jpeg ขนาดไม่เกิน 800K.
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
                  <Autocomplete
                    onChange={(_event, newItem) => {
                      setSelectedOwner(newItem);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.owner_name}
                    options={isOwners}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="เจ้าของสาขา"
                        variant="standard"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ListItem disablePadding>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="branch_name">ชื่อสาขา</InputLabel>
                      <Input
                        id="branch_name"
                        value={values.branch_name}
                        onChange={handleChange("branch_name")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="bxs:user-rectangle" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                      <InputLabel htmlFor="branch_phone">
                        เบอร์โทรศัพท์
                      </InputLabel>
                      <Input
                        id="branch_phone"
                        value={values.branch_phone}
                        onChange={handleChange("branch_phone")}
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
                      <InputLabel htmlFor="branch_vat_address">
                        ที่อยู่
                      </InputLabel>
                      <Input
                        id="branch_vat_address"
                        value={values.branch_vat_address}
                        onChange={handleChange("branch_vat_address")}
                        startAdornment={
                          <InputAdornment position="start">
                            <Icon icon="clarity:map-marker-solid-badged" />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </ListItem>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="branch_vat_number">
                      เลขที่จดทะเบียน
                    </InputLabel>
                    <Input
                      id="branch_vat_number"
                      value={values.branch_vat_number}
                      onChange={handleChange("branch_vat_number")}
                      startAdornment={
                        <InputAdornment position="start">
                          <Icon icon="fluent:book-number-24-regular" />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="วันที่หมดสัญญา"
                    value={values.branch_date_end}
                    defaultValue={values.branch_date_end}
                    onChange={(newValue) => {
                      setValues({
                        ...values,
                        branch_date_end: dayjs(newValue).format(),
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

                <FormControlLabel
                  control={<Switch checked={values.branch_status} />}
                  defaultValue={values.branch_status}
                  label={values.branch_status ? "ออนไลน์" : "ออฟไลน์"}
                  onChange={(e) => onChangeSwitchStatus(e)}
                />
                <br />
                <FormControlLabel
                  control={<Switch checked={values.branch_status_vat} />}
                  defaultValue={values.branch_status_vat}
                  label={
                    values.branch_status_vat
                      ? "เป็นผู้จดทะเบียน"
                      : "ไม่เป็นผู้จดทะเบียน"
                  }
                  onChange={(e) => onChangeSwitchStatusVat(e)}
                />
                {values.branch_status_vat && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItem disablePadding>
                      <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="branch_vat_name">
                          ชื่อที่จดทะเบียน
                        </InputLabel>
                        <Input
                          id="branch_vat_name"
                          value={values.branch_vat_name}
                          onChange={handleChange("branch_vat_name")}
                          startAdornment={
                            <InputAdornment position="start">
                              <Icon icon="bxs:user-rectangle" />
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </ListItem>
                  </Box>
                )}
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
