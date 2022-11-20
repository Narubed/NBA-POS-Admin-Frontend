/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import axios from "axios";

function headleSubmit({
  values,
  file,
  query,
  fetcherWithToken,
  router,
  token,
}) {
  if (file.length !== 0) {
    console.log("มีไฟล์");
    const formData = new FormData();
    if (values.branch_status_vat) {
      formData.append("branch_name", values.branch_name);
      formData.append("branch_status", values.branch_status);
      formData.append("branch_phone", values.branch_phone);
      formData.append("branch_status_vat", values.branch_status_vat);
      formData.append("branch_vat_name", values.branch_vat_name);
      formData.append("branch_vat_number", values.branch_vat_number);
      formData.append("branch_vat_address", values.branch_vat_address);
      formData.append("branch_date_end", values.branch_date_end);
      formData.append("branch_image", file);
    } else {
      formData.append("branch_name", values.branch_name);
      formData.append("branch_status", values.branch_status);
      formData.append("branch_phone", values.branch_phone);
      formData.append("branch_status_vat", values.branch_status_vat);
      formData.append("branch_vat_name", "ไม่มี");
      formData.append("branch_vat_number", values.branch_vat_number);
      formData.append("branch_vat_address", values.branch_vat_address);
      formData.append("branch_date_end", values.branch_date_end);
      formData.append("branch_image", file);
    }
    console.log(formData);

    Swal.fire({
      title: "ยืนยันการแก้ไข?",
      text: "คุณต้องการแก้ไขข้อมูลนี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/branch/${query.id}`;
        await axios({
          method: "PUT",
          url: url,
          data: formData,
          headers: {
            "Content-Type": "application/json",
            "auth-token": `Bearer ${token}`,
          },
        })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "ยืนยันการแก้ไข",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              router.push("/auth/branch");
            }, 1500);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  } else {
    let dataPut = {};
    if (values.branch_status_vat) {
      dataPut = {
        branch_name: values.branch_name,
        branch_status: values.branch_status,
        branch_phone: values.branch_phone,
        branch_status_vat: values.branch_status_vat,
        branch_vat_name: values.branch_vat_name,
        branch_vat_number: values.branch_vat_number,
        branch_vat_address: values.branch_vat_address,
        branch_date_end: values.branch_date_end,
      };
    } else {
      dataPut = {
        branch_name: values.branch_name,
        branch_status: values.branch_status,
        branch_phone: values.branch_phone,
        branch_status_vat: values.branch_status_vat,
        branch_vat_name: "ไม่มี",
        branch_vat_number: values.branch_vat_number,
        branch_vat_address: values.branch_vat_address,
        branch_date_end: values.branch_date_end,
      };
    }
    Swal.fire({
      title: "ยืนยันการแก้ไข?",
      text: "คุณต้องการแก้ไขข้อมูลนี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/branch/${query.id}`;
        await fetcherWithToken(url, {
          method: "PUT",
          body: JSON.stringify(dataPut),
        })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "ยืนยันการแก้ไข",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              router.push("/auth/branch");
            }, 1500);
          })
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถแก้ไขข้อมูลผู้ใช้ได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }
}

export default headleSubmit;
