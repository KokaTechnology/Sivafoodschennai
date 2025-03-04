import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import {
  Select,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  Divider,
  Button,
  Modal,
  Backdrop,
  CircularProgress,
  Autocomplete,
  Switch,
  Snackbar,
  Alert,
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
import { ADD, GET } from "../Functions/apiFunction";
import api from "../Data/api";
// import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import styled from "@emotion/styled";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90vw",
    sm: "80vw",
    md: "60vw",
    lg: "600px",
    xl: "600px",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 2,
  textAlign: "center",
};

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

function Transaction() {
  // const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [txns, settxns] = useState();
  const [mainproducts, setMainproducts] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [reFetch, setreFetch] = useState(false);
  const [startDate, setstartDate] = useState();
  const [backdropOpen, setbackdropOpen] = useState(false);
  const [endDate, setendDate] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleBackDropOpen = () => setbackdropOpen(true);
  const handleBackDropClose = () => setbackdropOpen(false);
  const [isDateRange, setisDateRange] = useState(false);
  const [dateRange, setdateRange] = useState([
    {
      endDate: new Date(),
      startDate: addDays(new Date(), -7),
      key: "selection",
    },
  ]);

  const [isAddNewModal, setisAddNewModal] = useState(false);
  const [users, setusers] = useState();

  const [selectedUser, setselectedUser] = useState();
  const [TransectionId, setTransectionId] = useState();
  const [Amount, setAmount] = useState();
  const [trasectionType, settrasectionType] = useState(2);
  const [discription, setdiscription] = useState();
  const [isUpdating, setisUpdating] = useState();

  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/txn`;
      const products = await GET(token, url);
      settxns(products.data);
      setMainproducts(products.data);
    };

    const getUsers = async () => {
      const url = `${api}/get_user`;
      const users = await GET(token, url);
      setusers(users.data);
    };
    getCat();
    getUsers();
  }, [token, reFetch]);

  const filter = async (url) => {
    handleBackDropOpen();
    const products = await GET(token, url);
    handleBackDropClose();
    settxns(products.data);
    setMainproducts(products.data);
  };

  const addNewTransection = async (e) => {
    e.preventDefault();

    if (trasectionType === 2 && Amount > selectedUser.wallet_amount) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("User Do not Have Enough Balence in Wallet");
      return;
    } else {
      setisUpdating(true);
      let data = {
        user_id: selectedUser.id,
        payment_id: TransectionId,
        amount: parseFloat(Amount),
        description: discription,
        type: trasectionType,
      };
      const url = `${api}/add_txn`;
      const addTransection = await ADD(token, url, data);
      setisUpdating(false);
      if (addTransection.response === 200) {
        handleSnakBarOpen();
        setreFetch(!reFetch);
        setalertType("success");
        setalertMsg("Seccess");
        handleClose();
      } else if (addTransection.response === 201) {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg(addTransection.message);
      } else {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg(addTransection.message);
      }
    }
  };

  const column = useMemo(
    () => [
      { field: "id", headerName: "id", width: 60 },

      { field: "payment_id", headerName: "Payment Id", width: 180 },
      { field: "amount", headerName: "Amount", width: 120 },
      { field: "name", headerName: "Name", width: 180 },
      { field: "phone", headerName: "Number", width: 180 },
      { field: "description", headerName: "Description", width: 200 },
      {
        field: "type",
        headerName: "Type",
        width: 100,
        renderCell: (params) => (
          <p>
            {params.row.type === 1
              ? "Credit"
              : params.row.type === 2
              ? "Debit"
              : ""}
          </p>
        ),
      },

      {
        field: "updated_at",
        headerName: "Last Update",
        width: 220,
        renderCell: (params) =>
          moment(params.row.updated_at).format("DD-MM-YYYY HH:MM:SS"),
      },
      // {
      //   field: "Action",
      //   headerName: "Action",
      //   width: 100,
      //   renderCell: (params) => (
      //     <button
      //       class="updateBtn"
      //       onClick={() => {
      //         //navigate(`/product/${params.row.id}`);
      //       }}
      //     >
      //       <i class="fa-regular fa-eye"></i>
      //     </button>
      //   ),
      // },
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
            setisAddNewModal(true);
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
        <div>
          {" "}
          <Typography
            variant="h2"
            component={"h2"}
            fontWeight={500}
            sx={{ textAlign: "center", pb: "8px" }}
          >
            Transactions
          </Typography>
          <Divider />
          <Box mt={4} display={"flex"} alignItems={"center"} gap={"30px"}>
            <TextField
              margin="normal"
              size="small"
              sx={{
                width: { xs: "40%", sm: "300px", md: "400px" },
                mb: "15px",
              }}
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
                  settxns(
                    searchArrayByValue(
                      mainproducts,
                      e.target.value.toLowerCase()
                    )
                  );
                }, 500);
              }}
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              id="outlined-basic"
              label="Select Date Range"
              variant="outlined"
              Autocomplete={false}
              size="small"
              color="secondary"
              onKeyDown={() => {
                return false;
              }}
              onClick={() => {
                handleOpen();
                setisAddNewModal(false);
              }}
              value={startDate && `${startDate} - ${endDate}`}
            />
            <Button
              variant="contained"
              sx={{
                fontWeight: "700",
                color: "fff",
                width: "150px",
              }}
              color="secondary"
              disabled={!isDateRange}
              onClick={() => {
                let url = `${api}/txn/by_date_range/${startDate}/${endDate}`;
                filter(url);
              }}
            >
              Submit
            </Button>
          </Box>
        </div>

        {txns ? (
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
              rows={txns}
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
        {isAddNewModal ? (
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h3" component="h2">
              Add New Transaction
            </Typography>

            <Box component="form" onSubmit={addNewTransection} sx={{ mt: 4 }}>
              <Autocomplete
                disablePortal
                sx={{ width: "100%" }}
                id="combo-box-demo"
                color="secondary"
                clearIcon
                options={users ? users : []}
                getOptionLabel={(option) =>
                  `${option?.id} , ${option?.name} ( ${
                    option.phone ? option?.phone : ""
                  }  ${option.email ? option?.email : ""})`
                }
                onChange={(e, data) => {
                  setselectedUser(data);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    Autocomplete={false}
                    label="Select User"
                    size="small"
                    fullWidth
                    required
                    color="secondary"
                  />
                )}
              />
              <Box display={"flex"} gap={"30px"} mt={1}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="Payment Id"
                  label="Payment Id"
                  name="Payment Id"
                  autoComplete="text"
                  autoFocus
                  size="small"
                  color="secondary"
                  onChange={(e) => {
                    setTransectionId(e.target.value);
                  }}
                />{" "}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="Amount"
                  label="Amount"
                  name="Amount"
                  autoComplete="number"
                  type="number"
                  inputMode="number"
                  inputProps={{ max: 5000, min: 1 }}
                  autoFocus
                  size="small"
                  color="secondary"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                />
              </Box>

              <Box mt={1} ml={1}>
                <Typography textAlign={"left"} fontSize={"20px"}>
                  Transection Type *
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Credit</Typography>
                  <AntSwitch
                    defaultChecked={trasectionType === 2}
                    onClick={() => {
                      settrasectionType(trasectionType === 1 ? 2 : 1);
                    }}
                  />
                  <Typography>Debit</Typography>
                </Stack>
              </Box>

              <TextField
                sx={{ mt: 3 }}
                margin="normal"
                required
                fullWidth
                id="Description"
                label="Description"
                name="Description"
                autoComplete="text"
                autoFocus
                size="small"
                color="secondary"
                onChange={(e) => {
                  setdiscription(e.target.value);
                }}
              />

              <button className="AddBtn" type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <CircularProgress color="inherit" />
                ) : (
                  "Add New Transection"
                )}
              </button>
            </Box>
          </Box>
        ) : (
          <Box sx={style}>
            {/* Date range Picker */}
            <DateRangePicker
              onChange={(item) => {
                setisDateRange(true);
                setstartDate(
                  moment(item.selection.startDate).format("YYYY-MM-DD")
                );
                setendDate(moment(item.selection.endDate).format("YYYY-MM-DD"));
                setdateRange([item.selection]);
              }}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={dateRange}
              direction="vertical"
              scroll={{ enabled: true }}
            />
            <Box mt={5}>
              {" "}
              <Button
                fullWidth
                variant="contained"
                sx={{ height: "30px", fontWeight: "700", color: "fff" }}
                color="primary"
                onClick={() => {
                  if (!startDate) {
                    setisDateRange(true);
                    setstartDate(
                      moment(dateRange[0].startDate).format("YYYY-MM-DD")
                    );
                    setendDate(
                      moment(dateRange[0].endDate).format("YYYY-MM-DD")
                    );
                  }
                  handleClose();
                }}
              >
                Set
              </Button>
            </Box>
          </Box>
        )}
      </Modal>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 5 }}
        open={backdropOpen}
        onClick={handleBackDropClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Transaction;
