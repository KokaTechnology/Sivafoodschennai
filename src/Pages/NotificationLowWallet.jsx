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
import { GET, ADD } from "../Functions/apiFunction";
import api from "../Data/api";
import "../Styles/buttons.css";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

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

function NotificationLowWallet() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pincode, setpincode] = useState();
  const [pageSize, setpageSize] = useState(100);
  const [open, setOpen] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [reFetch, setreFetch] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [minValue, setminValue] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  // update user state

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_specific_notification`;
      const subcat = await GET(token, url);
      setpincode(subcat.data);
    };
    getCat();
  }, [reFetch, token]);

  // add category
  const PushNotifiaction = async (e) => {
    e.preventDefault();
    if (minValue < 1) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Threshold Value must be greater then 0");
      return;
    }
    let data = {
      low_amount: minValue,
    };
    const url = `${api}/send_low_wallet_notificaiton`;

    setisUpdating(true);
    try {
      const pushNotification = await ADD(token, url, data);
      setisUpdating(false);
      handleClose();
      if (pushNotification.response === 200) {
        handleSnakBarOpen();
        setreFetch(!reFetch);
        setalertType("success");
        setalertMsg("New Notification Pushed successfully");
      } else if (pushNotification.response === 201) {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg(pushNotification.message);
      } else {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg(pushNotification.response.data.message);
      }
    } catch (error) {
      handleClose();
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(error);
    }
  };

  const column = useMemo(
    () => [
      { field: "id", headerName: "id", width: 60 },
      { field: "user_id", headerName: "User Id", width: 60 },
      { field: "title", headerName: "Title", width: 300, editable: true },
      { field: "body", headerName: "Body", width: 500, editable: true },
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
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>

        <button
          class="cssbuttons-io-button"
          onClick={() => {
            handleOpen();
          }}
        >
          {" "}
          Push Notification
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
            Low Wallet Balence Notifications
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
              rowsPerPageOptions={[100, 200, 250, 500, 1000]}
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
            Minimum Wallet Amount Threshold For Notification
          </Typography>
          <Box component="form" onSubmit={PushNotifiaction} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Threshold Amount"
              label="Threshold Amount"
              name="Threshold Amount"
              autoComplete="text"
              type="number"
              autoFocus
              value={minValue}
              size="small"
              color="secondary"
              onChange={(e) => {
                setminValue(e.target.value);
              }}
            />

            <button className="AddBtn" type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <CircularProgress color="inherit" />
              ) : (
                "Send Notification"
              )}
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default NotificationLowWallet;
