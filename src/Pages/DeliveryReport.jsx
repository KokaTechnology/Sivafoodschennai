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
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

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

function DeliveryReport() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reports, setreports] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [open, setOpen] = useState(false);
  const [clearAuto, setclearAuto] = useState(1);
  const [dataSet, setdataSet] = useState([]);
  const [backdropOpen, setbackdropOpen] = useState(false);
  //
  const [drivers, setdrivers] = useState();
  const [selectedDriver, setselectedDriver] = useState();
  const [isDateRange, setisDateRange] = useState(false);
  const [dateRange, setdateRange] = useState([
    {
      endDate: new Date(),
      startDate: addDays(new Date(), -7),
      key: "selection",
    },
  ]);
  const [startDate, setstartDate] = useState();
  const [endDate, setendDate] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleBackDropOpen = () => setbackdropOpen(true);
  const handleBackDropClose = () => setbackdropOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_report/delivery`;
      const report = await GET(token, url);
      setreports(report.data);

      let array = getDateValueArray(report.data);
      const data_Set = () => {
        let arr = [];
        for (let i = 0; i < array.length; i++) {
          let data = {
            date: array[i].date,
            value: array[i].values.length,
          };
          arr.push(data);
        }
        setdataSet(arr);
      };
      data_Set();
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

  const filter = async (url) => {
    handleBackDropOpen();
    const report = await GET(token, url);
    handleBackDropClose();
    setreports(report.data);

    let array = getDateValueArray(report.data);
    const data_Set = () => {
      let arr = [];
      for (let i = 0; i < array.length; i++) {
        let data = {
          date: array[i].date,
          value: array[i].values.length,
        };
        arr.push(data);
      }
      setdataSet(arr);
    };

    data_Set();
  };

  function getDateValueArray(inputArray) {
    // Create an object to store the unique dates and their values
    const dateValueObj = inputArray.reduce((acc, curr) => {
      // Get the current date from the input array item
      const currDate = curr.date;

      // If the date is not already in the accumulator object, add it
      if (!acc[currDate]) {
        acc[currDate] = [];
      }

      // Add the current item's value to the date's array in the accumulator object
      acc[currDate].push(1);

      return acc;
    }, {});

    // Convert the accumulator object to an array
    const dateValueArray = Object.entries(dateValueObj).map(
      ([date, values]) => {
        return { date, values };
      }
    );

    return dateValueArray;
  }

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

  const column = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 160 },
      { field: "s_phone", headerName: "Phone", width: 120 },
      { field: "entry_user_id", headerName: "User ID", width: 60 },
      { field: "title", headerName: "Title", width: 180 },
      { field: "order_id", headerName: "Order Id", width: 70 },
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
        field: "qty",
        headerName: "Quantity",
        width: 80,
        renderCell: (params) => {
          if (params.row.subscription_type === 2) {
            const dayCode = getDayName(
              moment(params.row.date).format("YYYY-MM-DD")
            );
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
        field: "pincode",
        headerName: "Pincode",
        width: 140,
      },
      {
        field: "created_at",
        headerName: "Created At",
        width: 220,
        renderCell: (params) =>
          moment(params.row.created_at).format("DD-MM-YYYY HH:MM:SS"),
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
      <Box sx={{ height: 600, width: "100%" }}>
        <Typography
          variant="h2"
          component={"h2"}
          fontWeight={500}
          sx={{ textAlign: "center", pb: "8px" }}
        >
          Delivery Report
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
              `${option?.name} ( ${option?.phone} , ${option?.email})`
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
            label="Select Date Range"
            variant="outlined"
            Autocomplete={false}
            size="small"
            color="secondary"
            onKeyDown={() => {
              return false;
            }}
            onClick={handleOpen}
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
            onClick={() => {
              if (selectedDriver && isDateRange === false) {
                let url = `${api}/get_report/delivery/${selectedDriver}`;
                filter(url);
              } else if (selectedDriver && isDateRange === true) {
                let url = `${api}/get_report/delivery/${selectedDriver}/${startDate}/${endDate}`;
                filter(url);
              } else if (!selectedDriver && isDateRange === true) {
                let url = `${api}/get_report/delivery/${startDate}/${endDate}`;
                filter(url);
              } else {
                let url = `${api}/get_report/delivery`;
                filter(url);
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
              setisDateRange(false);
              setselectedDriver();
              setclearAuto(clearAuto === 1 ? 0 : 1);
              setstartDate("");
              setendDate("");
              let url = `${api}/get_report/delivery`;
              filter(url);
            }}
          >
            Reset
          </Button>
        </Box>
        {dataSet && (
          <Box mt={5} mb={10} border={"1px solid #3D4B65"} borderRadius={"8px"}>
            <Typography
              variant="h2"
              component={"h2"}
              fontWeight={500}
              sx={{ textAlign: "center", pb: "8px", pt: "8px" }}
            >
              Statistics - Delivery Data
            </Typography>{" "}
            <Divider />
            <Box
              height={"350px"}
              display={"flex"}
              p={"20px"}
              justifyContent={"space-around"}
            >
              <Chart
                type="line"
                lineThickness="1"
                data={{
                  labels: dataSet.map((coin) => coin.date),
                  datasets: [
                    {
                      data: dataSet.map((coin) => coin.value),
                      label: `Total Delivery`,
                      borderWidth: 2,
                      fill: true,
                      borderColor: "#28a745",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: {
                    point: {
                      radius: 4,
                      borderWidth: 1,
                    },
                  },
                  datalabels: {
                    display: false,
                  },

                  plugins: {
                    datalabels: {
                      display: false,
                    },
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        beginAtZero: true,
                        display: false,
                      },
                      title: {
                        display: true,
                        text: "Delivery →",
                        font: {
                          size: "18px",
                          color: "#000",
                        },
                      },
                      display: true, // Hide Y axis labels
                      grid: {
                        color: "#28a7469f",
                        display: false,
                      },
                    },
                    x: {
                      ticks: {
                        beginAtZero: true,
                        display: false,
                      },
                      grid: {
                        color: "#28a7469f",
                        display: false,
                      },
                      title: {
                        display: true,
                        text: "Date →",
                        font: {
                          size: "18px",
                          color: "#000",
                        },
                      },
                      display: true, // Hide X axis labels
                    },
                  },
                }}
              />
            </Box>
          </Box>
        )}

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
                  setendDate(moment(dateRange[0].endDate).format("YYYY-MM-DD"));
                }
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

export default DeliveryReport;
