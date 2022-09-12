// component
import Iconify from "@/components/Iconify";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: "หน้าหลัก",
    path: "/",
    icon: getIcon("eva:pie-chart-2-fill"),
  },

  {
    title: "กิจการ",
    titleth: "ตรวจสอบออเดอร์",
    icon: getIcon("eva:people-fill"),
    children: [
      {
        title: "รายชื่อเจ้าของกิจการ",
        titleth: "รายชื่อเจ้าของกิจการ",
        path: "/auth/owner",
      },
      {
        title: "สร้างเจ้าของกิจการ",
        titleth: "สร้างเจ้าของกิจการ",
        path: "/auth/owner/create",
      },
      {
        title: "รายชื่อสาขาทั้งหมด",
        titleth: "รายชื่อสาขาทั้งหมด",
        path: "/auth/branch",
      },
      {
        title: "สร้างสาขาใหม่",
        titleth: "สร้างสาขาใหม่",
        path: "/auth/branch/create",
      },
    ],
  },

  // {
  //   title: "หน้าทดสอบ",
  //   path: "/auth/profile",
  //   icon: getIcon("eva:people-fill"),
  // },

  // {
  //   title: "blogs",
  //   path: "/auth/blogs",
  //   icon: getIcon("eva:shopping-bag-fill"),
  // },
  // {
  //   title: "checkorder",
  //   titleth: "ตรวจสอบออเดอร์",
  //   icon: (
  //     <Icon icon="twemoji:card-index" width={22} height={22} color="blue" />
  //   ),
  //   children: [
  //     {
  //       title: "checkorder",
  //       titleth: "ออเดอร์ศูนย์ภายในจังหวัด",
  //       path: "/auth/owner",
  //     },
  //     {
  //       title: "checkorder",
  //       titleth: "ออเดอร์ศูนย์(เขต/ภาค)",
  //       path: "/admin/AdminCheckOrderPartnerApp",
  //     },
  //   ],
  // },

  // {
  //   title: "blog",
  //   path: "/dashboard/blog",
  //   icon: getIcon("eva:file-text-fill"),
  // },
  // {
  //   title: "login",
  //   path: "/login",
  //   icon: getIcon("eva:lock-fill"),
  // },
  // {
  //   title: "register",
  //   path: "/register",
  //   icon: getIcon("eva:person-add-fill"),
  // },
  // {
  //   title: "Not found",
  //   path: "/404",
  //   icon: getIcon("eva:alert-triangle-fill"),
  // },
];

export default navConfig;
