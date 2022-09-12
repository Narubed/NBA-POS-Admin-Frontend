import { Button } from "@mui/material";
import { useRouter } from "next/router";

import SessionLayout from "@/components/layouts/reusable/SessionSubBar";
import DefaultLayout from "@/components/layouts/Default";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import NoSession from "@/sections/dashboard/NoSession";
import HaveSession from "@/sections/dashboard/HaveSession";

import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);

  return (
    <>
      {currentUser ? (
        <SessionLayout>
          <HaveSession />
        </SessionLayout>
      ) : (
        <DefaultLayout>
          <NoSession />
        </DefaultLayout>
      )}
    </>
  );
}
