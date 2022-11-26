import React from "react";
import { useSelector } from "react-redux";

import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Image from "next/image";

import ImageGif from "../../../public/images/GIF/loading-fast.gif";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const loading = useSelector((state) => state.session.loading);
  return (
    <div>
      <Dialog
        open={loading}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <Image
          src={ImageGif.src}
          width="150%"
          height="150%"
          alt={ImageGif.src}
        />
      </Dialog>
    </div>
  );
}
