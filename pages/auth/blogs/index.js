import SessionBar from "@/components/layouts/reusable/SessionSubBar";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

import Link from "next/link";

export default function Blogs() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetcherWithToken(
        "https://sakko-demo-api.herokuapp.com/api/v1/user/blogs"
      ).then((json) => {
        setBlogs(json);
      });
    }
  }, [currentUser]);

  useEffect(() => {}, [blogs]);
  return (
    <>
      <SessionBar>
        {currentUser && (
          <Link href="/auth/blogs/new">
            <Button>Create blogs</Button>
          </Link>
        )}

        {blogs && currentUser && blogs.length > 0 ? (
          blogs.map((item) => (
            <a key={item.id}>
              <Link href={`/auth/blogs/${item.id}`}>
                <a>{item.id}</a>
              </Link>
              <br />
              {item.body}
              <br />
            </a>
          ))
        ) : (
          <>loading</>
        )}
      </SessionBar>
    </>
  );
}
