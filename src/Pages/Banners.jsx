import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  useTheme,
} from "@mui/material";
import React from "react";
import { tokens } from "../theme";
import { useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import { GET, UPDATE, UPLOAD } from "../Functions/apiFunction";
import api from "../Data/api";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useEffect } from "react";
import image from "../Data/image";

function Banners() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [reFetch, setreFetch] = useState(false);
  const [loaded, setloaded] = useState(false);

  const [deleting, setdeleting] = useState();
  const [bannerImages, setbannerImages] = useState([]);
  const [uploading, setuploading] = useState(false);
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  useEffect(() => {
    // Get categoriues
    const getproduct = async () => {
      const url = `${api}/get_banner/mobile`;
      const banners = (await GET(token, url)).data;
      console.log(banners);
      setbannerImages(banners && banners.slice(0, 5));
      setloaded(true);
    };
    getproduct();
  }, [reFetch, token]);

  //   delete
  const deleteFile = async (id) => {
    const url = `${api}/delete_banner_image`;
    const data = {
      id: id,
    };
    setdeleting(true);
    const deleteImg = await UPDATE(token, url, data);
    setdeleting(false);
    if (deleteImg.response === 200) {
      setreFetch(!reFetch);
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg(deleteImg.message);
    } else if (deleteImg.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(deleteImg.message);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };
  return (
    <>
      <Snackbar
        open={snakbarOpen}
        autoHideDuration={3000}
        onClose={handleSnakBarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnakBarClose}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
          borderBottom:
            theme.palette.mode === "dark"
              ? "0.5px solid #E1E3E6"
              : "1px solid #757D8A",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 className="heading">Banner Images </h2>
        </div>
      </Box>
      {loaded ? (
        <Box>
          <div
            className="desc"
            style={{
              backgroundColor: colors.primary[400],
            }}
          >
            <h4>Upload or Delete Banner Images</h4>

            <Box display={"flex"} alignItems="center" gap="20px" mt={4}>
              <div class="container container-banner">
                {bannerImages?.map((slider) => (
                  <div className="img">
                    {" "}
                    <img
                      src={`${image}/${slider.image}`}
                      alt=""
                      width={"150px"}
                    />
                    <button
                      onClick={() => {
                        deleteFile(slider.id);
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        height: "30px",
                        padding: "0 10px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {deleting ? (
                        <CircularProgress size={10} color="white" />
                      ) : (
                        <DeleteOutline sx={{ fontSize: "28px" }} />
                      )}
                    </button>
                  </div>
                ))}

                {bannerImages.length >= 5 ? (
                  <></>
                ) : (
                  <div
                    className="upload"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <IconButton aria-label="upload picture" component="label">
                      <input
                        hidden
                        accept=".png, .jpg, .jpeg"
                        type="file"
                        onChange={async (e) => {
                          if (e.target.files[0].size / 1024 >= 3072) {
                            alert("File size must be less then 3MB");
                          }
                          if (
                            e.target.files &&
                            e.target.files[0] &&
                            e.target.files[0].size / 1024 <= 3072
                          ) {
                            let UploadUrl = `${api}/upload_banner_image`;
                            const uploadData = {
                              image: e.target.files[0],
                              image_type: 1,
                            };

                            setuploading(true);
                            const upload = await UPLOAD(
                              token,
                              UploadUrl,
                              uploadData
                            );
                            setuploading(false);

                            if (upload.response === 200) {
                              handleSnakBarOpen();
                              setalertType("success");
                              setalertMsg("Uploaded");
                              setreFetch(!reFetch);
                            } else if (upload.response === 201) {
                              handleSnakBarOpen();
                              setalertType("error");
                              setalertMsg(upload.message);
                            } else {
                              handleSnakBarOpen();
                              setalertType("error");
                              setalertMsg(
                                "Something went Wrong! Please Try Again"
                              );
                            }
                          }
                        }}
                      />
                      {uploading ? (
                        <CircularProgress />
                      ) : (
                        <AddPhotoAlternateIcon sx={{ fontSize: "80px" }} />
                      )}
                    </IconButton>
                  </div>
                )}
              </div>
            </Box>
          </div>
        </Box>
      ) : (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
          {/* For other variants, adjust the size with `width` and `height` */}

          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
          <Skeleton variant="rectangular" width={"100%"} height={60} />
          <Skeleton variant="rounded" width={"100%"} height={60} />
        </Stack>
      )}
    </>
  );
}

export default Banners;
