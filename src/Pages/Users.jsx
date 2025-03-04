import React, { useMemo } from "react";
import { useState, useEffect } from "react";
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
  useTheme,
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
import { ADD, GET, UPDATE } from "../Functions/apiFunction";
import api from "../Data/api";
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

function Users() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setisLoading] = useState(false);
  const [users, setusers] = useState();
  const [MainUsers, setMainUsers] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [reFetch, setreFetch] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAddModel, setisAddModel] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [userID, setuserID] = useState();
  const [role_id, setrole_id] = useState();
  const [id_role, setid_role] = useState();

  // userDetails

  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [number, setnumber] = useState();
  const [walletAmt, setwalletAmt] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_user`;
      const users = await GET(token, url);
      console.log(users.data);
      setusers(users.data);
      setMainUsers(users.data);
    };
    getCat();
  }, [reFetch, token]);

  // Add User
  const addUser = async (e) => {
    e.preventDefault();
    const data = {
      phone: number,
      name: name,
      email: email,
    };
    const url = `${api}/add_user`;
    setisLoading(true);
    const user = await ADD(token, url, data);
    setisLoading(false);
    if (user.response === 200) {
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg(`New User Added successfully`);
      setreFetch(!reFetch);
      handleClose();
    } else if (user.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(user.message);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // assign user
  const assignUser = async (e) => {
    e.preventDefault();
    const data = {
      user_id: userID,
      role_id: 4,
    };
    const url = `${api}/add_assign_user`;
    setisLoading(true);
    const user = await ADD(token, url, data);
    setisLoading(false);
    if (user.response === 200) {
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("User Assigned As Delivery Boy");
      setreFetch(!reFetch);
      handleClose();
    } else if (user.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(user.message);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };
  // assign user
  const deAssignUser = async (e) => {
    e.preventDefault();
    const data = {
      id: id_role,
    };
    const url = `${api}/delete_assign_user`;
    setisLoading(true);
    const user = await ADD(token, url, data);
    setisLoading(false);
    if (user.response === 200) {
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("User Dessigned As Delivery Boy");
      setreFetch(!reFetch);
      handleClose();
    } else if (user.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(user.message);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // update User
  const updateUser = async (e) => {
    e.preventDefault();
    const data = {
      phone: number,
      name: name,
      email: email,
      wallet_amount: walletAmt,
      id: userID,
    };
    const url = `${api}/update_user`;
    setisLoading(true);
    const update = await UPDATE(token, url, data);
    setisLoading(false);
    if (update.response === 200) {
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("User Details Updated successfully");
      setreFetch(!reFetch);
      handleClose();
    } else if (update.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(update.message);
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
            <img src={params.row.image} alt={params.row.image} />
          ) : (
            <i class="fa-solid fa-user-tie" style={{ fontSize: "22px" }}></i>
          ),
      },
      { field: "name", headerName: "Name", width: 180 },
      { field: "email", headerName: "Email", width: 250 },
      { field: "phone", headerName: "Phone", width: 150 },
      {
        field: "wallet_amount",
        headerName: "Wallet Amount",
        width: 100,
        renderCell: (params) => (
          <p
            style={{
              color:
                params.row.wallet_amount === null ||
                params.row.wallet_amount < 250
                  ? "red"
                  : "#54B435",
              fontWeight:
                params.row.wallet_amount === null ||
                params.row.wallet_amount < 250
                  ? "700"
                  : "700",
            }}
          >
            {params.row.wallet_amount === null ? 0 : params.row.wallet_amount}
          </p>
        ),
      },
      // {
      //   field: "role",
      //   headerName: "Role",
      //   width: 150,
      //   renderCell: (params) => (
      //     <>
      //       {params.row.role.length ? (
      //         params.row.role.map((role, index) => (
      //           <p key={index}>{role.role_title}</p>
      //         ))
      //       ) : (
      //         <p>USER</p>
      //       )}
      //     </>
      //   ),
      //   type: "string",
      // },
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
              setname(params.row.name);
              setemail(params.row.email);
              setnumber(params.row.phone);
              setuserID(params.row.id);
              setwalletAmt(
                params.row.wallet_amount === null ? 0 : params.row.wallet_amount
              );
              setrole_id(
                params.row.role.length ? params.row.role[0].role_id : null
              );
              setid_role(params.row.role.length ? params.row.role[0].id : null);
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
          <GridToolbarExport color="secondary" sx={{ fontSize: "14px" }} />
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
            setname("");
            setemail("");
            setnumber("");
            setisAddModel(true);
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
            flexDirection: "row-reverse",
          }}
        >
          {" "}
          <Typography variant="h3" component={"h3"} sx={{ textAlign: "left" }}>
            Manage Users
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
                      return false;
                    });
                  });
                }
                setusers(
                  searchArrayByValue(MainUsers, e.target.value.toLowerCase())
                );
              }, 500);
            }}
          />
        </div>

        {users ? (
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
              rows={users}
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
            {isAddModel ? "Add New User" : "Update User Details"}
          </Typography>
          {isAddModel ? (
            <Box component="form" sx={{ mt: 1 }} onSubmit={addUser}>
              <TextField
                margin="normal"
                color="secondary"
                required
                fullWidth
                id="Name"
                label="Name"
                name="Name"
                autoComplete="text"
                autoFocus
                value={name}
                size="small"
                onChange={(e) => {
                  setname(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                color="secondary"
                required={number ? false : true}
                fullWidth
                id="Email"
                label="Email"
                name="Email"
                autoComplete="email"
                type="email"
                autoFocus
                value={email}
                size="small"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                color="secondary"
                required={email ? false : true}
                fullWidth
                id="Number"
                label="Number"
                name="Number"
                autoComplete="Number"
                type="tel"
                inputProps={{
                  inputMode: "tel",
                  pattern: "[0-9]*",
                  maxlength: "12",
                }}
                autoFocus
                value={number}
                size="small"
                onChange={(e) => {
                  setnumber(e.target.value);
                }}
              />

              <input
                type="file"
                name="image"
                id="image"
                className="imageInput"
                accept="image/*"
                disabled
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontWeight: "700" }}
                color="secondary"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress /> : `Add New User `}
              </Button>
            </Box>
          ) : (
            <>
              {" "}
              <Box component="form" sx={{ mt: 1 }} onSubmit={updateUser}>
                <TextField
                  margin="normal"
                  color="secondary"
                  required
                  fullWidth
                  id="Title"
                  label="Title"
                  name="Title"
                  autoComplete="text"
                  autoFocus
                  value={name}
                  size="small"
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  color="secondary"
                  required={number ? false : true}
                  fullWidth
                  id="Email"
                  label="Email"
                  name="Email"
                  autoComplete="email"
                  type="email"
                  autoFocus
                  value={email}
                  size="small"
                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  color="secondary"
                  required={email ? false : true}
                  fullWidth
                  id="Number"
                  label="Number"
                  name="Number"
                  autoComplete="Number"
                  type="tel"
                  inputProps={{
                    inputMode: "tel",
                    pattern: "[0-9]*",
                    maxlength: "12",
                  }}
                  value={number}
                  size="small"
                  onChange={(e) => {
                    setnumber(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  color="secondary"
                  fullWidth
                  id="Wallet Amount"
                  label="Wallet Amount"
                  name="Wallet Amount"
                  autoComplete="Number"
                  type="tel"
                  inputProps={{
                    inputMode: "tel",
                    pattern: "[0-9]*",
                    maxlength: "9",
                  }}
                  value={walletAmt}
                  size="small"
                  onChange={(e) => {
                    setwalletAmt(e.target.value);
                  }}
                />
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="imageInput"
                  accept="image/*"
                  disabled
                />

                {role_id === 1 || role_id === 2 ? (
                  ""
                ) : role_id === 4 ? (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, fontWeight: "700" }}
                    color="primary"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      deAssignUser(e);
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      "De-assign As Delivery Boy"
                    )}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, fontWeight: "700" }}
                    color="primary"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      assignUser(e);
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      "Assign As Delivery Boy"
                    )}
                  </Button>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, fontWeight: "700" }}
                  color="secondary"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress /> : "Update"}
                </Button>
                {/* <Button
                  onClick={addUser}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, fontWeight: "700" }}
                  color="error"
                  disabled
                >
                  {isLoading ? <CircularProgress /> : "Delete"}
                </Button> */}
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default Users;
