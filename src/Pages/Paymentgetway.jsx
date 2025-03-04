import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Switch,
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
import { GET, UPDATE } from "../Functions/apiFunction";
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

function Paymentgetway() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [setting, setsetting] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [open, setOpen] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [reFetch, setreFetch] = useState(false);
  // eslint-disable-next-line
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);
  const [isUpdating, setisUpdating] = useState(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  // update user state
  // eslint-disable-next-line
  const [Id, setId] = useState("");
  const [keyID, setkeyID] = useState();
  const [secretId, setsecretId] = useState();
  const [isActive, setisActive] = useState(0);

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_payment_getway`;
      const subcat = await GET(token, url);
      setsetting(subcat.data);
    };
    getCat();
  }, [reFetch, token]);

  // add category
  const UpdateSetting = async (e) => {
    e.preventDefault();
    const data = {
      id: Id,
      secret_id: secretId,
      key_id: keyID,
      active: isActive,
    };
    const url = `${api}/update_payment_getway`;
    setisUpdating(true);
    const addsubcat = await UPDATE(token, url, data);
    if (addsubcat.response === 200) {
      setisUpdating(false);
      handleSnakBarOpen();
      handleClose();
      setreFetch(!reFetch);
      setisUpdating(false);
      setalertType("success");
      setalertMsg("Web App Setting Updated");
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

      { field: "title", headerName: "Title", width: 180 },
      {
        field: "secret_id",
        headerName: "Secret ID",
        width: 250,
      },
      {
        field: "key_id",
        headerName: "Key ID",
        width: 250,
      },
      {
        field: "active",
        headerName: "Status",
        width: 250,
        renderCell: (params) =>
          params.row.active === 1 ? "Active" : "Deactive",
      },

      {
        field: "updated_at",
        headerName: "Updated At",
        width: 220,
        renderCell: (params) =>
          params.row.updated_at === null
            ? "N/A"
            : moment(params.row.updated_at).format("DD-MM-YYYY HH:MM:SS"),
      },
      {
        field: "",
        headerName: "Update",
        width: 100,
        renderCell: (params) => (
          <button
            class="updateBtn"
            onClick={() => {
              setId(params.row.id);
              setkeyID(params.row.key_id);
              setsecretId(params.row.secret_id);
              setisActive(params.row.active);
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
            Manage Payment Getway setting
          </Typography>
        </div>

        {setting ? (
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
              rows={setting}
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
            Update Web App Setting
          </Typography>
          <Box component="form" onSubmit={UpdateSetting} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Setting ID"
              label="Setting ID"
              name="Setting ID"
              autoComplete="text"
              autoFocus
              value={Id}
              size="small"
              disabled
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id=""
              label="Secret ID"
              name="Secret ID"
              autoComplete="text"
              autoFocus
              value={secretId}
              onChange={(e) => {
                setsecretId(e.target.value);
              }}
              size="small"
              color="secondary"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="keyid"
              label="Key ID"
              name="Key ID"
              autoComplete="text"
              autoFocus
              multiline
              maxRows={8}
              value={keyID}
              size="small"
              onChange={(e) => {
                setkeyID(e.target.value);
              }}
              color="secondary"
            />

            <FormControlLabel
              value="Active ?"
              control={
                <Switch
                  color="secondary"
                  checked={isActive === 1}
                  onChange={() => {
                    setisActive(isActive === 1 ? 0 : 1);
                  }}
                />
              }
              label="Active ?"
              labelPlacement="start"
            />

            <button className="AddBtn" type="submit" disabled={isUpdating}>
              {isUpdating ? <CircularProgress color="inherit" /> : "Update"}
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Paymentgetway;
