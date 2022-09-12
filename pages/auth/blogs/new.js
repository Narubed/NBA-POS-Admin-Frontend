import SessionLayout from "@/components/layouts/Session";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default function Blogs() {
  const router = useRouter();
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [blog, setBlog] = useState({});

  useEffect(() => {
    if (currentUser) {
      //
    }
  }, [currentUser]);

  return <SessionLayout>123</SessionLayout>;
}
