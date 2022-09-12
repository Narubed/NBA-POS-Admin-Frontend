/* eslint-disable react-hooks/rules-of-hooks */
import SessionLayout from "@/components/layouts/reusable/SessionSubBar";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { useEffect, useState } from "react";

export default function profile() {
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [blog, setBlog] = useState([]);

  useEffect(() => {

    if (currentUser) {
      fetcherWithToken(
        "https://sakko-demo-api.herokuapp.com/api/v1/user/blogs"
      ).then((json) => {
        setBlog(json);
      });
    }
  }, [currentUser]);

  return (
    <SessionLayout>
      {blog &&
        blog.length > 0 &&
        blog.map((item) => (
          <a key={item.id}>
            {item.title}
            <br />
          </a>
        ))}
    </SessionLayout>
  );
}
