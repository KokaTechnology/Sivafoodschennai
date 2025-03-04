import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import { Stack } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";
import { ADDMulti, GET } from "../Functions/apiFunction";
import api from "../Data/api";
import "../Styles/buttons.css";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import image from "./../Data/image";

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

function Notification() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pincode, setpincode] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [open, setOpen] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [reFetch, setreFetch] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);
  const [isUpdating, setisUpdating] = useState(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  // update user state
  const [title, settitle] = useState("");
  const [body, setbody] = useState();
  const [img, setimg] = useState();
  const [uploadImage, setuploadImage] = useState();

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_user_notification`;
      const subcat = await GET(token, url);
      setpincode(subcat.data);
    };
    getCat();
  }, [reFetch, token]);

  // add category
  const addNotifiaction = async (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("title", title);
    data.append("body", body);
    if (uploadImage) {
      data.append("image_base_url", image);
      data.append("image", uploadImage);
    }
    const url = `${api}/add_user_notification`;
    setisUpdating(true);
    const addsubcat = await ADDMulti(token, url, data);
    console.log(addsubcat);
    if (addsubcat.response === 200) {
      setisUpdating(false);
      handleSnakBarOpen();
      handleClose();
      setreFetch(!reFetch);
      setisUpdating(false);
      setalertType("success");
      settitle("");
      setbody("");
      setuploadImage("");
      setimg("");
      setalertMsg("New Notification added successfully");
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={`${image}/${params.row.image}`}
                alt={params.row.image}
                height={"45px"}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <i class="fa-regular fa-image" style={{ fontSize: "22px" }}></i>
            </div>
          ),
      },

      { field: "title", headerName: "Title", width: 220 },
      { field: "body", headerName: "Body", width: 220 },
      {
        field: "created_at",
        headerName: "Created At",
        width: 220,
        renderCell: (params) =>
          moment(params.row.updated_at).format("DD-MM-YYYY HH:MM:SS"),
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
            handleOpen();
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
          }}
        >
          {" "}
          <Typography variant="h3" component={"h3"} sx={{ textAlign: "left" }}>
            Manage Notification
          </Typography>
        </div>

        {pincode ? (
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
              rows={pincode}
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
            Add New Notification
          </Typography>
          <Box component="form" onSubmit={addNotifiaction} sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              id="Body"
              label="Body"
              name="Body"
              autoComplete="text"
              autoFocus
              value={body}
              size="small"
              color="secondary"
              onChange={(e) => {
                setbody(e.target.value);
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
                "Add New Notification"
              )}
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Notification;
