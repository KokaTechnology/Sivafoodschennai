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
import { Stack } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";
import { GET } from "../Functions/apiFunction";
import api from "../Data/api";
import "../Styles/buttons.css";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";

function UpcomingOrders() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reports, setreports] = useState();
  const [pageSize, setpageSize] = useState(20);

  const [clearAuto, setclearAuto] = useState(1);
  const [backdropOpen, setbackdropOpen] = useState(false);
  //
  const [drivers, setdrivers] = useState();
  const [selectedDriver, setselectedDriver] = useState();
  const handleBackDropOpen = () => setbackdropOpen(true);
  const handleBackDropClose = () => setbackdropOpen(false);

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_upcoming_delivery/normal`;
      const report = await GET(token, url);
      setreports(report.data);
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
  };

  const column = useMemo(
    () => [
      { field: "id", headerName: "Order ID", width: 80 },
      { field: "name", headerName: "Name", width: 150 },
      { field: "s_phone", headerName: "Phone", width: 120 },
      { field: "title", headerName: "Title", width: 220 },
      {
        field: "order_type",
        headerName: "Order Type",
        width: 130,
        renderCell: (params) => (
          <p>
            {params.row.order_type === 1
              ? "Prepaid"
              : params.row.order_type === 2
              ? "Postpaid"
              : params.row.order_type === 3
              ? "Pay Now"
              : params.row.order_type === 4
              ? "Pay Leter"
              : ""}
          </p>
        ),
      },
      {
        field: "pincode",
        headerName: "Pincode",
        width: 140,
      },
      {
        field: "qty",
        headerName: "Quantity",
        width: 140,
      },
      {
        field: "qty_text",
        headerName: "Quantity Text",
        width: 140,
      },
      {
        field: "order__assign_user",
        headerName: "Delivery Boy ID",
        width: 220,
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
          Upcoming Orders
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
                let url = `${api}/get_normal_order/emp_user/${selectedDriver}`;
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
              setselectedDriver();
              setclearAuto(clearAuto === 1 ? 0 : 1);
              let url = `${api}/get_upcoming_delivery/normal`;
              filter(url);
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

export default UpcomingOrders;
