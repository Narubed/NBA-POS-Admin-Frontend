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
      fetcherWithToken(
        `https://sakko-demo-api.herokuapp.com/api/v1/user/blogs/${router.query.id}`
      ).then((res) => {
        setBlog(res);
      });
      //
    }
  }, [currentUser]);

  return <SessionLayout>{blog.title}</SessionLayout>;
}
