import { Button, Card } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import bgimage from '../../../public/images/Background/bglogin3.png'

export default function NoSession() {
  const router = useRouter();

  return (
    <>
      <Card
        sx={{
          backgroundImage: `url(${bgimage.src})`,
          backgroundSize: "cover",
          height: "100vh",
          padding: 5,
          backgroundPosition: "top",
          textAlign: "center",
          borderRadius: "0px",
        }}
      >
        <div style={{ marginTop: "30vh" }}>
          <Button variant="contained" onClick={() => router.push("/login")}>
            go to login page
          </Button>
        </div>
      </Card>
    </>
  );
}
