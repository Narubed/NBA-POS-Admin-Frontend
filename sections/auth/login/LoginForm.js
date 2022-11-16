import * as Yup from "yup";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import { Link, Stack, IconButton, InputAdornment } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "@/components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFCheckbox,
} from "@/components/hook-form";

import { useDispatch } from "react-redux";
import { setToken } from "@/lib/store/session";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "aof@gmail.com",
    password: "987654321",
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/signin`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: e.email,
        password: e.password,
      }),
    });
    const json = await response.json();
    if (!json.status) {
      console.log("JOSN", json);
      Swal.fire({
        icon: "info",
        title: `${json.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      console.log(json);
      dispatch(setToken(json.token));
      Swal.fire({
        icon: "success",
        title: `${json.message}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          sx={{ input: { color: "#FFFFFF" } }}
          name="email"
          label={<a style={{ color: "#FFFFFF" }}>Email address</a>}
        />

        <RHFTextField
          name="password"
          sx={{ input: { color: "#FFFFFF" } }}
          label={<a style={{ color: "#FFFFFF" }}>Password</a>}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      ></Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        color="info"
      >
        เข้าสู่ระบบ
      </LoadingButton>
    </FormProvider>
  );
}
