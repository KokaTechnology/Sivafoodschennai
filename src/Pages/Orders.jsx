import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import {
  Select,
  TextField,
  Typography,
  useTheme,
  MenuItem,
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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "../theme";
import image from "./../Data/image";

function Orders() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setorders] = useState();
  const [mainproducts, setMainproducts] = useState();
  const [pageSize, setpageSize] = useState(20);

  const dispatch = useDispatch();

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;
  const status = (id) => {
    const data = [
      {
        id: 1,
        text: "Confirmed",
      },
      {
        id: 2,
        text: "Canceled",
      },
      {
        id: 0,
        text: "Pending",
      },
    ];
    const ttl = data.filter((dt) => dt.id === id);
    return ttl[0].text;
  };

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_order`;
      const products = await GET(token, url);
      setorders(products.data);
      setMainproducts(products.data);
    };
    getCat();
  }, [token, dispatch]);

  const column = useMemo(
    () => [
      { field: "id", headerName: "id", width: 60 },
      { field: "trasation_id", headerName: "Trasation Id", width: 90 },
      { field: "title", headerName: "Product", width: 180 },
      {
        field: "image",
        headerName: "Image",
        width: 100,
        height: 100,
        renderCell: (params) =>
          params.row.product_image != null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <img
                src={`${image}/${params.row.product_image}`}
                alt={params.row.product_image}
                height={"45px"}
              />
            </div>
          ) : (
            <i class="fa-regular fa-image" style={{ fontSize: "22px" }}></i>
          ),
      },
      {
        field: "order_type",
        headerName: "Order type",
        width: 140,
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
              : params.row.subscription_type === null
              ? "N/A"
              : "N/A"}
          </p>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        renderCell: (params) => <p>{status(params.row.status)}</p>,
      },
      {
        field: "order_status",
        headerName: "Order Status",
        width: 100,
        renderCell: (params) =>
          params.row.subscription_type !== null ? (
            <p>{params.row.order_status === 0 ? "Active" : "Stopped"}</p>
          ) : (
            <p>{params.row.order_status === 0 ? "Active" : "N/A"}</p>
          ),
      },
      {
        field: "",
        headerName: "Subscription Type",
        width: 140,
        renderCell: (params) => (
          <p>
            {params.row.subscription_type === 1
              ? "One Time Order"
              : params.row.subscription_type === 2
              ? "Weekly"
              : params.row.subscription_type === 3
              ? "Monthly"
              : params.row.subscription_type === 4
              ? "alternative days"
              : params.row.subscription_type === null
              ? "N/A"
              : "N/A"}
          </p>
        ),
      },
      {
        field: "wallet_amount",
        headerName: "Wallet Amount",
        width: 100,
      },
      { field: "name", headerName: "Name", width: 180 },
      { field: "s_phone", headerName: "Number", width: 120 },
      { field: "qty", headerName: "Quantity", width: 100 },
      { field: "order_amount", headerName: "Amount", width: 100 },
      { field: "start_date", headerName: "Start Date", width: 100 },
      { field: "pincode", headerName: "Pincode", width: 100 },

      {
        field: "updated_at",
        headerName: "Last Update",
        width: 220,
        renderCell: (params) =>
          moment(params.row.updated_at).format("DD-MM-YYYY HH:MM:SS"),
      },
      {
        field: "Action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => (
          <button
            class="updateBtn"
            onClick={() => {
              navigate(`/order/${params.row.id}`);
            }}
          >
            <i class="fa-regular fa-eye"></i>
          </button>
        ),
      },
    ],
    [navigate]
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
            navigate("/neworder");
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
            Manage Orders
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
                setorders(
                  searchArrayByValue(mainproducts, e.target.value.toLowerCase())
                );
              }, 500);
            }}
          />
        </div>

        {orders ? (
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
              rows={orders}
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
    </div>
  );
}

export default Orders;
