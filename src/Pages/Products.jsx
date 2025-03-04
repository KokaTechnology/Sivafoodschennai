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
import { updateProducts } from "../Redux/Store/productSlice";

import { tokens } from "../theme";
import image from "../Data/image";

function Products() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setproducts] = useState();
  const [mainproducts, setMainproducts] = useState();
  const [pageSize, setpageSize] = useState(20);

  const dispatch = useDispatch();

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  useEffect(() => {
    // Get categoriues
    const getCat = async () => {
      const url = `${api}/get_product`;
      const products = await GET(token, url);
      setproducts(products.data);
      setMainproducts(products.data);
      dispatch(updateProducts(products.data));
    };
    getCat();
  }, [token, dispatch]);

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
            <i class="fa-regular fa-image" style={{ fontSize: "22px" }}></i>
          ),
      },

      { field: "title", headerName: "Title", width: 180 },
      { field: "qty_text", headerName: "Quantity", width: 100 },
      {
        field: "subscription",
        headerName: "Subscription Type",
        width: 140,
        renderCell: (params) => (
          <p>
            {params.row.subscription === 0
              ? "Non Subscription"
              : params.row.subscription === 1
              ? "Subscription"
              : params.row.subscription === null
              ? "N/A"
              : "N/A"}
          </p>
        ),
      },
      { field: "stock_qty", headerName: "Stock", width: 100 },
      { field: "price", headerName: "Price", width: 100 },
      { field: "mrp", headerName: "MRP", width: 100 },
      { field: "cat_title", headerName: "Category", width: 150 },
      { field: "sub_cat_title", headerName: "Sub Category", width: 150 },

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
              navigate(`/product/${params.row.id}`);
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
            navigate("/addproduct");
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
            Manage Products
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
                setproducts(
                  searchArrayByValue(mainproducts, e.target.value.toLowerCase())
                );
              }, 500);
            }}
          />
        </div>

        {products ? (
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
              rows={products}
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

export default Products;
