import React, { useEffect, useMemo, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Modal,
  Select,
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
import { GET } from "../Functions/apiFunction";
import api from "../Data/api";
import "../Styles/buttons.css";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Calendar } from "react-date-range";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "90vw",
    sm: "fit-content",
    md: "fit-content",
    lg: "fit-content",
    xl: "fit-content",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "8px",
  p: 2,
  textAlign: "center",
};

function UpcomingSubsOrder() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reports, setreports] = useState();
  const [pageSize, setpageSize] = useState(100);
  const [open, setOpen] = useState(false);
  const [clearAuto, setclearAuto] = useState(1);
  const [backdropOpen, setbackdropOpen] = useState(false);
  //
  const [drivers, setdrivers] = useState();
  const [selectedDriver, setselectedDriver] = useState();

  const [date, setdate] = useState(moment(Date.now()).format("YYYY-MM-DD"));
  const [nowDate, setnowDate] = useState(Date.now());
  const [memoDate, setmemoDate] = useState(
    moment(Date.now()).format("YYYY-MM-DD")
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleBackDropOpen = () => setbackdropOpen(true);
  const handleBackDropClose = () => setbackdropOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  function getDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    const day = date.toLocaleDateString(undefined, options);
    switch (day) {
      case "Sunday":
        return 0;
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      default:
        return null;
    }
  }

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_upcoming_delivery/sub_date/${date}`;
      const report = await GET(token, url);
      const reportData = report.data;
      console.log(reportData);
      const filter1 = () => {
        let arr = [];
        for (let i = 0; i < reportData.length; i++) {
          const element = reportData[i];
          const dateToCheck = new Date(date); // Date to check if it exists
          const data = element.user_holiday;
          const dateExists = data.some((item) => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === dateToCheck.toDateString();
          });
          if (dateExists !== true) {
            if (element.order_type === 1) {
              if (element.subscription_type === 2) {
                const dayCode = getDayName(date);
                const string = element.selected_days_for_weekly;
                const validJSONString = string.replace(
                  /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
                  '"$2": '
                );
                const array = JSON.parse(validJSONString);
                const containsDayQty = array.find(
                  (obj) => obj.dayCode === dayCode
                );

                if (
                  containsDayQty &&
                  element.wallet_amount >=
                    containsDayQty.qty * element.order_amount
                ) {
                  arr.push(element);
                }
              } else if (
                element.subscription_type === 1 ||
                element.subscription_type === 3 ||
                element.subscription_type === 4
              ) {
                if (element.wallet_amount >= element.order_amount) {
                  arr.push(element);
                }
              }
            } else if (element.order_type === 2) {
              arr.push(element);
            }
          }
        }
        return arr;
      };

      const filter2 = () => {
        let arr = [];
        for (let i = 0; i < filter1().length; i++) {
          const element = filter1()[i];
          const dt1 = new Date(element.start_date);
          const dt2 = new Date(date);
          if (dt2.getTime() >= dt1.getTime()) {
            if (element.subscription_type === 1) {
              const d1 = new Date(element.start_date);
              const d2 = new Date(date);
              if (d2.getTime() === d1.getTime()) {
                arr.push(element);
              }
            } else if (element.subscription_type === 4) {
              const currentDate = new Date(element.start_date);
              const finalDate = new Date(date);
              while (currentDate <= finalDate) {
                if (currentDate.getTime() === finalDate.getTime()) {
                  arr.push(element);
                  break; // Exit the loop when the current date matches the end date
                }
                currentDate.setDate(currentDate.getDate() + 2); // Skip the next date
              }
            } else if (element.subscription_type === 2) {
              const dayCode = getDayName(date);
              const string = element.selected_days_for_weekly;
              const validJSONString = string.replace(
                /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
                '"$2": '
              );
              const array = JSON.parse(validJSONString);
              const containsDayCode = array.some(
                (obj) => obj.dayCode === dayCode
              );

              if (containsDayCode === true) {
                arr.push(element);
              }
            } else if (element.subscription_type === 3) {
              arr.push(element);
            }
          }
        }
        return arr;
      };

      setreports(filter2());
    };
    const getDriver = async () => {
      const url = `${api}/get_user/role/4`;
      const drivers = await GET(token, url);
      setdrivers(drivers.data);
    };
    getCat();
    getDriver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filter = async (url, date) => {
    handleBackDropOpen();
    const report = await GET(token, url);
    handleBackDropClose();
    const reportData = report.data;
    console.log(reportData);
    const filter1 = () => {
      let arr = [];
      for (let i = 0; i < reportData.length; i++) {
        const element = reportData[i];
        const dateToCheck = new Date(date); // Date to check if it exists
        const data = element.user_holiday;
        const dateExists = data.some((item) => {
          const itemDate = new Date(item.date);
          return itemDate.toDateString() === dateToCheck.toDateString();
        });
        if (dateExists !== true) {
          if (element.order_type === 1) {
            if (element.subscription_type === 2) {
              const dayCode = getDayName(date);
              const string = element.selected_days_for_weekly;
              const validJSONString = string.replace(
                /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
                '"$2": '
              );
              const array = JSON.parse(validJSONString);
              const containsDayQty = array.find(
                (obj) => obj.dayCode === dayCode
              );

              if (
                containsDayQty &&
                element.wallet_amount >=
                  containsDayQty.qty * element.order_amount
              ) {
                arr.push(element);
              }
            } else if (
              element.subscription_type === 1 ||
              element.subscription_type === 3 ||
              element.subscription_type === 4
            ) {
              if (element.wallet_amount >= element.order_amount) {
                arr.push(element);
              }
            }
          } else if (element.order_type === 2) {
            arr.push(element);
          }
        }
      }
      return arr;
    };

    const filter2 = () => {
      let arr = [];
      for (let i = 0; i < filter1().length; i++) {
        const element = filter1()[i];
        const dt1 = new Date(element.start_date);
        const dt2 = new Date(date);
        if (dt2.getTime() >= dt1.getTime()) {
          if (element.subscription_type === 1) {
            const d1 = new Date(element.start_date);
            const d2 = new Date(date);
            if (d2.getTime() === d1.getTime()) {
              arr.push(element);
            }
          } else if (element.subscription_type === 4) {
            const currentDate = new Date(element.start_date);
            const finalDate = new Date(date);
            while (currentDate <= finalDate) {
              if (currentDate.getTime() === finalDate.getTime()) {
                arr.push(element);
                break; // Exit the loop when the current date matches the end date
              }
              currentDate.setDate(currentDate.getDate() + 2); // Skip the next date
            }
          } else if (element.subscription_type === 2) {
            const dayCode = getDayName(date);
            const string = element.selected_days_for_weekly;
            const validJSONString = string.replace(
              /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
              '"$2": '
            );
            const array = JSON.parse(validJSONString);
            const containsDayCode = array.some(
              (obj) => obj.dayCode === dayCode
            );

            if (containsDayCode === true) {
              arr.push(element);
            }
          } else if (element.subscription_type === 3) {
            arr.push(element);
          }
        }
      }
      return arr;
    };

    setreports(filter2());
    setmemoDate(date);
  };

  const column = useMemo(
    () => [
      { field: "id", headerName: "Order ID", width: 80 },
      { field: "name", headerName: "Name", width: 150 },
      { field: "s_phone", headerName: "Phone", width: 120 },
      { field: "title", headerName: "Title", width: 220 },
      {
        field: "subscription_type",
        headerName: "Subscription Type",
        width: 130,
        renderCell: (params) => (
          <p>
            {params.row.subscription_type === 1
              ? "One Time Order"
              : params.row.subscription_type === 2
              ? "Weekly"
              : params.row.subscription_type === 3
              ? "Monthly"
              : params.row.subscription_type === 4
              ? "Alternative Days"
              : "N/A"}
          </p>
        ),
      },
      {
        field: "order_type",
        headerName: "Order Type",
        width: 120,
        renderCell: (params) => (
          <p>
            {params.row.order_type === 1
              ? "Prepaid"
              : params.row.order_type === 2
              ? "Postpaid"
              : "N/A"}
          </p>
        ),
      },
      {
        field: "delivered_date",
        headerName: "Delivery Status",
        width: 130,
        renderCell: (params) => (
          <p>
            {params.row.delivered_date === null ? (
              <p style={{ color: "red" }}>
                <b>Not Delivered</b>
              </p>
            ) : (
              <p style={{ color: "green" }}>
                <b>Delivered</b>
              </p>
            )}
          </p>
        ),
      },

      {
        field: "start_date",
        headerName: "Start Date",
        width: 140,
      },
      {
        field: "pincode",
        headerName: "Pincode",
        width: 140,
      },
      {
        field: "qty",
        headerName: "Quantity",
        width: 80,
        renderCell: (params) => {
          if (params.row.subscription_type === 2) {
            const dayCode = getDayName(memoDate);
            console.log(dayCode);
            const string = params.row.selected_days_for_weekly;
            const validJSONString = string.replace(
              /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
              '"$2": '
            );
            const array = JSON.parse(validJSONString);
            const containsDayCode = array.find(
              (obj) => obj.dayCode === dayCode
            );
            return containsDayCode.qty;
          }
        },
      },
      {
        field: "qty_text",
        headerName: "Quantity Text",
        width: 140,
      },
      {
        field: "order_assign_user",
        headerName: "Delivery Boy ID",
        width: 130,
      },
      {
        field: "wallet_amount",
        headerName: "Wallet Balence",
        width: 120,
      },
    ],

    [memoDate]
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
      <Box sx={{ height: 600, width: "100%" }}>
        <Typography
          variant="h2"
          component={"h2"}
          fontWeight={500}
          sx={{ textAlign: "center", pb: "8px" }}
        >
          Upcoming Subscription Orders
        </Typography>
        <Divider />

        <Box mt={4} display={"flex"} alignItems={"center"} gap={"30px"}>
          <Autocomplete
            key={clearAuto}
            disablePortal
            sx={{ width: "40%" }}
            id="combo-box-demo"
            color="secondary"
            clearIcon
            options={drivers ? drivers : []}
            getOptionLabel={(option) =>
              `${option?.id}  ${option?.name} ( ${option?.phone} , ${option?.email})`
            }
            onChange={(e, data) => {
              setselectedDriver(data.user_id);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                Autocomplete={false}
                label="Select Driver"
                size="small"
                fullWidth
                color="secondary"
              />
            )}
          />

          <TextField
            InputLabelProps={{ shrink: true }}
            id="outlined-basic"
            label="Select Date"
            variant="outlined"
            Autocomplete={false}
            size="small"
            color="secondary"
            onKeyDown={() => {
              return false;
            }}
            onClick={handleOpen}
            value={date}
          />

          <Button
            variant="contained"
            sx={{
              fontWeight: "700",
              color: "fff",
              width: "150px",
            }}
            color="secondary"
            onClick={() => {
              if (selectedDriver) {
                let url = `${api}/get_upcoming_delivery/sub_date/assign_user/${selectedDriver}/${date}`;
                const Maindate = date;
                filter(url, Maindate);
              } else {
                const url = `${api}/get_upcoming_delivery/sub_date/${date}`;
                const Maindate = date;
                filter(url, Maindate);
              }
            }}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            sx={{ fontWeight: "700", color: "fff" }}
            color="primary"
            onClick={() => {
              setdate(moment(Date.now()).format("YYYY-MM-DD"));
              setselectedDriver();
              setclearAuto(clearAuto === 1 ? 0 : 1);
              const date = moment(Date.now()).format("YYYY-MM-DD");
              const url = `${api}/get_upcoming_delivery/sub_date/${date}`;
              filter(url, date);
            }}
          >
            Reset
          </Button>
        </Box>

        {reports ? (
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
              rows={reports}
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
          <Calendar onChange={(item) => setnowDate(item)} date={nowDate} />
          <Box mt={5}>
            {" "}
            <Button
              fullWidth
              variant="contained"
              sx={{ height: "30px", fontWeight: "700", color: "fff" }}
              color="primary"
              onClick={() => {
                setdate(moment(nowDate).format("YYYY-MM-DD"));
                handleClose();
              }}
            >
              Set
            </Button>
          </Box>
        </Box>
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

export default UpcomingSubsOrder;
