/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Box,
  Container,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  Button,
  ListItem,
  FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import { setLoading } from "../../../lib/store/session";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    color: "purple",
    width: "100%",
    textAlign: "center",
  },
}));

function HaveSession() {
  const dispatch = useDispatch();
  const { currentUser, fetcherWithToken } = useCurrentUser();
  const [isIdAdvert, setIdAdvert] = useState("");
  const [isImages, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [isImage, setImage] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchAdvert();
      console.log(currentUser);
    }
  }, []);
  const fetchAdvert = async () => {
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/advert`;
    fetcherWithToken(url, { method: "GET" }).then((json) => {
      setIdAdvert(json.data?._id);
      setImages(json.data?.advert_images);
    });
  };

  const headleOpenImage = (props) => {
    setImage(props);
    setOpen(true);
  };

  const inputOneFile = async (event) => {
    dispatch(setLoading(true));
    const token = localStorage.getItem("jwt");
    const valueImage = isImages;
    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/images/advert`,
        formData,
        {
          headers: {
            "auth-token": `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setImage(res.data.filename);
        valueImage.push(res.data.filename);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถเพิ่มข้อมูลได้",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/advert/${isIdAdvert}`;
    fetcherWithToken(url, {
      method: "PUT",
      body: JSON.stringify({ advert_images: valueImage }),
    });

    await setTimeout(() => {
      dispatch(setLoading(false));
      setImages(valueImage);
    }, 500);
  };

  const onClickDeleteImage = async (props) => {
    const newImage = [];
    const token = localStorage.getItem("jwt");
    isImages.forEach((element) => {
      if (element !== props) {
        newImage.push(element);
      }
    });
    dispatch(setLoading(true));
    await axios.delete(
      `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/images/advert`,
      {
        headers: {
          "auth-token": `Bearer ${token}`,
        },
        data: {
          images: props,
        },
      }
    );
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/advert/${isIdAdvert}`;
    await fetcherWithToken(url, {
      method: "PUT",
      body: JSON.stringify({ advert_images: newImage }),
    });
    dispatch(setLoading(false));
    setImages(newImage);
  };

  return (
    <Container>
      โฆษณาหน้าจอฝั่งลูกค้า
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ListItem disablePadding>
            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
              <ButtonStyled
                component="label"
                variant="contained"
                htmlFor="account-settings-upload-image"
              >
                เพิ่มรูปภาพ
                <input
                  hidden
                  type="file"
                  onChange={inputOneFile}
                  accept="image/png, image/jpeg"
                  id="account-settings-upload-image"
                />
              </ButtonStyled>
              {/* <FileUpload
                    name="invoice"
                    accept="image/*"
                    customUpload
                    uploadHandler={invoiceUploadHandler}
                    mode="basic"
                    auto
                    chooseLabel="Upload invoice"
                  /> */}
            </FormControl>
          </ListItem>
        </Grid>
        {isImages?.map((item) => (
          <Grid item xs={4} key={item}>
            {" "}
            <Box
              bgColor="white"
              borderRadius="xl"
              shadow="lg"
              minHeight="10rem"
              sx={{
                overflow: "hidden",
                transform:
                  "perspective(999px) rotateX(0deg) translate3d(0, 0, 0)",
                transformOrigin: "50% 0",
                backfaceVisibility: "hidden",
                willChange: "transform, box-shadow",
                transition: "transform 200ms ease-out",

                "&:hover": {
                  transform:
                    "perspective(999px) rotateX(7deg) translate3d(0px, -4px, 5px)",
                },
              }}
            >
              <Box position="absolute" top={0} right={0} zIndex={2} p={0}>
                <IconButton
                  onClick={() => onClickDeleteImage(item)}
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ m: 0, p: 0 }}
                >
                  <Icon
                    icon="typcn:delete"
                    color="red"
                    width="24"
                    height="24"
                  />
                </IconButton>
              </Box>
              <Box position="absolute" top={0} left={0} zIndex={2} p={0}>
                <IconButton
                  onClick={() => headleOpenImage(item)}
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ m: 0, p: 0 }}
                >
                  <Icon
                    icon="fluent:search-visual-24-filled"
                    color="#FFFFFF"
                    width="24"
                    height="24"
                  />
                </IconButton>
              </Box>
              <Box
                component="img"
                src={`${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/static/advert/${item}`}
                width="100%"
                my="auto"
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Box
              component="img"
              src={`${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/static/advert/${isImage}`}
              width="100%"
              my="auto"
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            ออก
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HaveSession;
