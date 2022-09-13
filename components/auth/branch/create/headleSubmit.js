import Swal from "sweetalert2";
import axios from "axios";

function headleSubmit({ values, file, router, token, isSelectedOwner }) {
  if (file.length !== 0) {
    const formData = new FormData();
    if (values.branch_status_vat) {
      formData.append("branch_owner_id", isSelectedOwner._id);
      formData.append("branch_name", values.branch_name);
      formData.append("branch_status", values.branch_status);
      formData.append("branch_phone", values.branch_phone);
      formData.append("branch_status_vat", values.branch_status_vat);
      formData.append("branch_vat_name", values.branch_vat_name);
      formData.append("branch_vat_number", values.branch_vat_number);
      formData.append("branch_vat_address", values.branch_vat_address);
      formData.append("branch_image", file);
    } else {
      formData.append("branch_owner_id", isSelectedOwner._id);
      formData.append("branch_name", values.branch_name);
      formData.append("branch_status", values.branch_status);
      formData.append("branch_phone", values.branch_phone);
      formData.append("branch_status_vat", values.branch_status_vat);
      formData.append("branch_vat_name", "ไม่มี");
      formData.append("branch_vat_number", values.branch_vat_number);
      formData.append("branch_vat_address", values.branch_vat_address);
      formData.append("branch_image", file);
    }

    Swal.fire({
      title: "ยืนยันการเพิ่มข้อมูล",
      text: "คุณต้องการเพิ่มข้อมูลนี้หรือไม่ ! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/branch`;
        await axios({
          method: "POST",
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
              title: "ยืนยันการเพิ่มสาขา",
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
              title: "ไม่สามารถเพิ่มข้อมูลผสาขาได้",
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  }
}

export default headleSubmit;
