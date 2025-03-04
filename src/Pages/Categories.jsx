import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import moment from "moment/moment";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";
import { ADD, DELETE, GET, UPDATE, UPLOAD } from "../Functions/apiFunction";
import api from "../Data/api";
import { updateCategory } from "../Redux/Store/CategorySlice";
import { useDispatch } from "react-redux";
import "../Styles/buttons.css";
import { DeleteOutline } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import image from "../Data/image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90vw", sm: 500, md: 500, lg: 500, xl: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 2,
};

function Categories() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setcategories] = useState();
  const [mainCat, setmainCat] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [open, setOpen] = useState(false);
  const [isAddModel, setisAddModel] = useState(false);
  const [dailogOpne, setdailogOpne] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [reFetch, setreFetch] = useState(false);
  const [img, setimg] = useState();
  const [uploadImage, setuploadImage] = useState();
  const [deleting, setdeleting] = useState(false);
  const [imgId, setimgId] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDailogOpen = () => setdailogOpne(true);
  const handleDailogClose = () => setdailogOpne(false);
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);
  const [isUpdating, setisUpdating] = useState(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  // update user state
  const [title, settitle] = useState("");
  const [Id, setId] = useState("");

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_cat`;
      const subcat = await GET(token, url);
      setcategories(subcat.data);
      setmainCat(subcat.data);
      dispatch(updateCategory(subcat.data));
    };
    getCat();
  }, [reFetch, token, dispatch]);

  // Update Product

  const update = async (e) => {
    e.preventDefault();
    var data = JSON.stringify({
      id: Id,
      title: title,
    });
    const url = `${api}/update_cat`;
    setisUpdating(true);
    const update = await UPDATE(token, url, data);
    console.log(update);

    if (update.response === 200) {
      if (uploadImage) {
        let UploadUrl = `${api}/cat/upload_image`;
        let uploadData = {
          image: uploadImage,
          image_type: 1,
          id: Id,
        };
        await UPLOAD(token, UploadUrl, uploadData);
      }
      setisUpdating(false);
      handleClose();
      handleSnakBarOpen();
      setreFetch(!reFetch);
      setalertType("success");
      setalertMsg("Updated successfully");
    } else if (update.response === 201) {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(update.message);
    } else {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // add category
  const Addcat = async (e) => {
    e.preventDefault();
    const data = JSON.stringify({
      title: title,
    });
    const url = `${api}/add_cat`;
    setisUpdating(true);
    const addsubcat = await ADD(token, url, data);
    console.log(addsubcat);

    if (addsubcat.response === 200) {
      if (uploadImage) {
        let UploadUrl = `${api}/cat/upload_image`;
        let uploadData = {
          image: uploadImage,
          image_type: 1,
          id: addsubcat.id,
        };
        await UPLOAD(token, UploadUrl, uploadData);
      }
      setisUpdating(false);
      handleSnakBarOpen();
      handleClose();
      setreFetch(!reFetch);
      setisUpdating(false);
      setalertType("success");
      setalertMsg("New Category added successfully");
    } else if (addsubcat.response === 201) {
      setisUpdating(false);
      handleSnakBarOpen();
      setisUpdating(false);
      setalertType("error");
      setalertMsg(addsubcat.message);
    } else {
      setisUpdating(false);
      handleSnakBarOpen();
      setisUpdating(false);
      setalertType("error");
      setalertMsg(addsubcat.response.data.message);
    }
  };

  // delete
  const deleteCat = async (e) => {
    e.preventDefault();
    var deleteData = JSON.stringify({
      id: Id,
    });
    const url = `${api}/delete_cat`;
    setisUpdating(true);
    const deleteSub = await DELETE(token, url, deleteData);
    setisUpdating(false);
    console.log(deleteSub);

    if (deleteSub.response === 200) {
      handleDailogClose();
      handleClose();
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("Successfully Deleted");
      setreFetch(!reFetch);
    } else {
      handleDailogClose();
      handleSnakBarOpen();
      setisUpdating(false);
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // delete image
  const deleteFile = async (id) => {
    const url = `${api}/cat/delete_image`;
    const data = {
      id: id,
    };
    setdeleting(true);
    const deleteImg = await DELETE(token, url, data);
    setdeleting(false);
    if (deleteImg.response === 200) {
      setreFetch(!reFetch);
      handleSnakBarOpen();
      setalertType("success");
      handleClose();
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

  const column = useMemo(
    () => [
      { field: "id", headerName: "id", width: 60 },
      {
        field: "image",
        headerName: "Image",
        width: 100,
        height: 100,
        renderCell: (params) =>
          params.row.image != null ? (
            <img
              src={`${image}/${params.row.image}`}
              alt={params.row.image}
              width={"45px"}
            />
          ) : (
            <i class="fa-regular fa-image" style={{ fontSize: "22px" }}></i>
          ),
      },
      { field: "title", headerName: "Title", width: 180 },
      {
        field: "updated_at",
        headerName: "Last Update",
        width: 220,
        renderCell: (params) =>
          moment(params.row.updated_at).format("DD-MM-YYYY HH:MM:SS"),
      },
      {
        field: "Update",
        headerName: "Update",
        width: 100,
        renderCell: (params) => (
          <button
            class="updateBtn"
            onClick={() => {
              setisAddModel(false);
              settitle(params.row.title);
              setId(params.row.id);
              setimg(
                params.row.image != null && `${image}/${params.row.image}`
              );
              setimgId(params.row.image_id && params.row.image_id);
              handleOpen();
            }}
          >
            <span class="icon">
              <i class="fa-regular fa-pen-to-square"></i>
            </span>
          </button>
        ),
      },
    ],
    []
  );

  // custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          {" "}
          <GridToolbarExport
            color="secondary"
            sx={{ fontSize: "15px", fontWeight: "600" }}
          />
          <Select
            sx={{
              width: "100px",
              height: "30px",
              marginLeft: "20px",
            }}
            color="primary"
            size="small"
            labelId="demo-select-small"
            id="demo-select-small"
            value={pageSize}
            label="Page Size"
            onChange={(e) => {
              setpageSize(e.target.value);
            }}
            className="TopPageBar"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>

        <button
          class="cssbuttons-io-button"
          onClick={() => {
            settitle("");
            setisAddModel(true);
            handleOpen();
            setimg("");
          }}
        >
          {" "}
          Add New
          <div class="icon">
            <i class="fa-regular fa-plus"></i>
          </div>
        </button>
      </GridToolbarContainer>
    );
  }

  return (
    <div>
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
      <Box sx={{ height: 600, width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        >
          {" "}
          <Typography variant="h3" component={"h3"} sx={{ textAlign: "left" }}>
            Manage Categories
          </Typography>
          <TextField
            margin="normal"
            size="small"
            sx={{ width: { xs: "80%", sm: "300px", md: "500px" } }}
            id="Search"
            label="Search"
            name="Search"
            color="secondary"
            onChange={(e) => {
              e.preventDefault();
              setTimeout(() => {
                function searchArrayByValue(arr, searchQuery) {
                  return arr.filter((obj) => {
                    return Object.values(obj).some((val) => {
                      if (typeof val === "string") {
                        return val
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase());
                      }
                      if (typeof val === "number") {
                        return val
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase());
                      }
                      return false;
                    });
                  });
                }
                setcategories(
                  searchArrayByValue(mainCat, e.target.value.toLowerCase())
                );
              }, 500);
            }}
          />
        </div>

        {categories ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              paddingBottom: "30px",
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-row": {
                fontSize: "14px",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.navbarBG[400],
                borderBottom: "none",
                color: "#f5f5f5",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
                borderBottom: "#000",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.navbarBG[400],
                color: "#f5f5f5 !important",
              },
              "& .MuiTablePagination-root": {
                color: "#f5f5f5 !important",
              },
              "& .MuiTablePagination-selectIcon": {
                color: "#f5f5f5 !important",
              },
              "& .MuiTablePagination-actions botton": {
                color: "#f5f5f5 !important",
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            {" "}
            <DataGrid
              sx={{ fontSize: "13px" }}
              columns={column}
              rows={categories}
              components={{ Toolbar: CustomToolbar }}
              rowsPerPageOptions={[10, 20, 25, 50, 100]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setpageSize(newPageSize)}
            />
          </Box>
        ) : (
          <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            {/* For other variants, adjust the size with `width` and `height` */}

            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={"100%"}
              height={30}
            />
          </Stack>
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isAddModel ? "Add New Category" : "Update Categories"}
          </Typography>
          {isAddModel ? (
            <Box component="form" onSubmit={Addcat} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Title"
                label="Title"
                name="Title"
                autoComplete="text"
                autoFocus
                value={title}
                size="small"
                color="secondary"
                onChange={(e) => {
                  settitle(e.target.value);
                }}
              />

              <input
                style={{
                  marginTop: "20px",
                  padding: "8px 4px",
                  border: "1px solid #0000003b",
                  width: "100%",
                  borderRadius: "8px",
                }}
                type="file"
                name="image"
                id="image"
                className="imageInput"
                accept=".png, .jpg, .jpeg"
                color="secondary"
                onChange={(e) => {
                  if (e.target.files[0].size / 1024 >= 2048) {
                    alert("file size must be less then 2mb");
                  }
                  if (
                    e.target.files &&
                    e.target.files[0] &&
                    e.target.files[0].size / 1024 <= 2048
                  ) {
                    setimg(URL.createObjectURL(e.target.files[0]));
                    setuploadImage(e.target.files[0]);
                  }
                }}
              />
              {img && (
                <img
                  src={img}
                  alt={img}
                  style={{ width: "100px", height: "auto", marginTop: "20px" }}
                />
              )}

              <button className="AddBtn" type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Add New Catagory"
                )}
              </button>
            </Box>
          ) : (
            <>
              {" "}
              <Box component="form" onSubmit={update} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Title"
                  label="Title"
                  color="secondary"
                  name="Title"
                  autoComplete="text"
                  autoFocus
                  value={title}
                  size="small"
                  onChange={(e) => {
                    settitle(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  color="secondary"
                  name="id"
                  label="Id"
                  type="Id"
                  id="Id"
                  value={Id}
                  disabled
                  size="small"
                />
                {!imgId && (
                  <input
                    style={{
                      marginTop: "20px",
                      padding: "8px 4px",
                      border: "1px solid #0000003b",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                    type="file"
                    name="image"
                    id="image"
                    className="imageInput"
                    accept=".png, .jpg, .jpeg"
                    color="secondary"
                    onChange={(e) => {
                      if (e.target.files[0].size / 1024 >= 2048) {
                        alert("file size must be less then 2mb");
                      }
                      if (
                        e.target.files &&
                        e.target.files[0] &&
                        e.target.files[0].size / 1024 <= 2048
                      ) {
                        setimg(URL.createObjectURL(e.target.files[0]));
                        setuploadImage(e.target.files[0]);
                      }
                    }}
                  />
                )}
                {img && (
                  <div
                    className="img"
                    style={{
                      position: "relative",
                      marginTop: "20px",
                      width: "100px",
                    }}
                  >
                    <img
                      src={img}
                      alt={img}
                      style={{
                        width: "100px",
                        height: "auto",
                      }}
                    />
                    {imgId && (
                      <button
                        onClick={() => {
                          deleteFile(imgId);
                        }}
                        type="button"
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
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
                          <DeleteOutline sx={{ fontSize: "16px" }} />
                        )}
                      </button>
                    )}
                  </div>
                )}

                <div
                  className="bttns"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      fontWeight: "700",
                      color: "#fff",
                      width: "43%",
                    }}
                    color="update"
                    disabled={isUpdating}
                  >
                    {isUpdating ? <CircularProgress /> : "Update"}
                  </Button>

                  <Button
                    onClick={handleDailogOpen}
                    variant="contained"
                    sx={{ mt: 3, mb: 2, fontWeight: "700", width: "43%" }}
                    color="error"
                    disabled={isUpdating}
                  >
                    {isUpdating ? <CircularProgress /> : "Delete"}
                  </Button>
                </div>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Dailog */}
      <Dialog
        open={dailogOpne}
        onClose={handleDailogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>
              Do you want to delete{" "}
              <b>
                <span>{title}</span>
              </b>
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDailogClose} color="secondary">
            Cancel
          </Button>

          <Button
            variant="contained"
            size="small"
            onClick={deleteCat}
            autoFocus
            color="error"
          >
            {isUpdating ? <CircularProgress /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Categories;
