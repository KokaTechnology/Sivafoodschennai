import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import {
  Button,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import "../Styles/product.css";
import TextField from "@mui/material/TextField";
import api from "./../Data/api";
import { ADD, GET } from "../Functions/apiFunction";
import { tokens } from "../theme";
import moment from "moment";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function NewOrder() {
  const products = useSelector((state) => {
    return state.Products[state.Products.length - 1];
  });
  console.log(products);
  const users = useSelector((state) => {
    return state.Users[state.Users.length - 1];
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [isProductSubsType, setisProductSubsType] = useState(0);
  const [userId, setuserId] = useState();
  const [productId, setproductId] = useState();
  const [price, setprice] = useState(0);
  const [MRP, setMRP] = useState(0);
  const [tax, settax] = useState(0);
  const [orderAmount, setorderAmount] = useState();
  const [date, setdate] = useState();
  const [addressID, setaddressID] = useState();
  const [quantity, setquantity] = useState(1);
  const [subsType, setsubsType] = useState();
  const [status, setstatus] = useState();
  const [order_status, setorder_status] = useState(0);
  const [type, settype] = useState(1);
  const [paymentMode, setpaymentMode] = useState(1);

  const [name, setname] = useState();
  const [number, setnumber] = useState();
  const [apartment, setapartment] = useState();
  const [flat, setflat] = useState();
  const [area, setarea] = useState();
  const [landmark, setlandmark] = useState();
  const [city, setcity] = useState();
  const [pincode, setpincode] = useState();

  const [addnew, setaddnew] = useState(false);
  const [LOADING, setLOADING] = useState(false);
  const [address, setaddress] = useState();
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");

  // days state
  const [M, setM] = useState();
  const [T, setT] = useState();
  const [W, setW] = useState();
  const [TH, setTH] = useState();
  const [F, setF] = useState();
  const [S, setS] = useState();
  const [SU, setSU] = useState();
  // dayqt
  const [M_QT, setM_QT] = useState(1);
  const [T_QT, setT_QT] = useState(1);
  const [W_QT, setW_QT] = useState(1);
  const [TH_QT, setTH_QT] = useState(1);
  const [F_QT, setF_QT] = useState(1);
  const [S_QT, setS_QT] = useState(1);
  const [SU_QT, setSU_QT] = useState(1);

  let selected_days = [
    {
      d: M,
      qt: M_QT,
      id: 1,
      name: "Monday",
      add: function () {
        setM_QT(M_QT + 1);
      },
      remove: function () {
        setM_QT(M_QT > 1 ? M_QT - 1 : 1);
      },
    },
    {
      d: T,
      qt: T_QT,
      id: 2,
      name: "Tuesday",
      add: function () {
        setT_QT(T_QT + 1);
      },
      remove: function () {
        setT_QT(T_QT > 1 ? T_QT - 1 : 1);
      },
    },
    {
      d: W,
      qt: W_QT,
      id: 3,
      name: "Wednesday",
      add: function () {
        setW_QT(W_QT + 1);
      },
      remove: function () {
        setW_QT(W_QT > 1 ? W_QT - 1 : 1);
      },
    },
    {
      d: TH,
      qt: TH_QT,
      id: 4,
      name: "Thursday",
      add: function () {
        setTH_QT(TH_QT + 1);
      },
      remove: function () {
        setTH_QT(TH_QT > 1 ? TH_QT - 1 : 1);
      },
    },
    {
      d: F,
      qt: F_QT,
      id: 5,
      name: "Friday",
      add: function () {
        setF_QT(F_QT + 1);
      },
      remove: function () {
        setF_QT(F_QT > 1 ? F_QT - 1 : 1);
      },
    },
    {
      d: S,
      qt: S_QT,
      id: 6,
      name: "Saturday",
      add: function () {
        setS_QT(S_QT + 1);
      },
      remove: function () {
        setS_QT(S_QT > 1 ? S_QT - 1 : 1);
      },
    },
    {
      d: SU,
      qt: SU_QT,
      id: 0,
      name: "Sunday",
      add: function () {
        setSU_QT(SU_QT + 1);
      },
      remove: function () {
        setSU_QT(SU_QT > 1 ? SU_QT - 1 : 1);
      },
    },
  ];

  const selectDays = () => {
    let arr = [];
    for (let index = 0; index < selected_days.length; index++) {
      if (selected_days[index].d !== undefined) {
        arr.push({
          dayCode: selected_days[index].d,
          qty: selected_days[index].qt,
        });
      }
    }
    let string = "";

    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      string += `{dayCode:${obj.dayCode}, qty:${obj.qty}},`;
    }
    string = `[${string.slice(0, -1)}]`;
    return {
      arr: arr,
      string: string,
    };
  };

  var today = moment().format("YYYY-MM-DD");

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  // days

  const addOrder = async (e) => {
    e.preventDefault();
    if (subsType === 2 && !selectDays().arr.length) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Please Select Delivery Days and Per Day Quality");
      return;
    }
    setLOADING(true);
    if (addnew) {
      const addresData = {
        user_id: userId,
        name: name,
        s_phone: number,
        flat_no: flat,
        apartment_name: apartment,
        area: area,
        landmark: landmark,
        city: city,
        pincode: pincode,
      };

      let url = `${api}/add_address`;
      const address = await ADD(token, url, addresData);
      if (address.response === 200) {
        if (type === 3) {
          let transectionData = {
            user_id: userId,
            amount: orderAmount,
            payment_id: "xxx",
            type: 2,
            description: "Amount paid",
            payment_mode: paymentMode,
          };
          let url = `${api}/add_order_txn`;
          const transectionID = await ADD(token, url, transectionData);

          if (transectionID.response === 200) {
            const data = {
              user_id: userId,
              product_id: productId,
              order_amount: (orderAmount * quantity).toFixed(2),
              start_date: date,
              qty: quantity,
              address_id: address.id,
              subscription_type: subsType,
              status: status,
              order_status: order_status,
              order_type: type,
              selected_days_for_weekly:
                subsType === 2 ? selectDays().string : null,
              price: price,
              mrp: MRP,
              tax: tax,
              trasation_id: transectionID.id,
            };
            const url = `${api}/add_order`;
            const add = await ADD(token, url, data);
            setLOADING(false);
            if (add.response === 200) {
              handleSnakBarOpen();
              setalertType("success");
              setalertMsg("New Order Added successfully");
              setTimeout(() => {
                navigate("/Orders");
              }, 1000);
            } else if (add.response === 201) {
              handleSnakBarOpen();
              setalertType("error");
              setalertMsg(add.message);
            } else {
              handleSnakBarOpen();
              setalertType("error");
              setalertMsg("Something went Wrong! Please Try Againn");
            }
          } else {
            handleSnakBarOpen();
            setalertType("error");
            setalertMsg("Something went Wrong! Please Try Againn");
            return;
          }
        }

        const data = {
          user_id: userId,
          product_id: productId,
          order_amount: (orderAmount * quantity).toFixed(2),
          start_date: date,
          qty: quantity,
          address_id: address.id,
          subscription_type: subsType,
          status: status,
          order_status: order_status,
          order_type: type,
          selected_days_for_weekly: subsType === 2 ? selectDays().string : null,
          price: price,
          mrp: MRP,
          tax: tax,
          trasation_id: null,
        };
        const url = `${api}/add_order`;
        const add = await ADD(token, url, data);
        setLOADING(false);
        if (add.response === 200) {
          handleSnakBarOpen();
          setalertType("success");
          setalertMsg("New Order Added successfully");
          setTimeout(() => {
            navigate("/Orders");
          }, 1000);
        } else if (add.response === 201) {
          handleSnakBarOpen();
          setalertType("error");
          setalertMsg(add.message);
        } else {
          handleSnakBarOpen();
          setalertType("error");
          setalertMsg("Something went Wrong! Please Try Againn");
        }
      } else if (address.response === 201) {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg(address.message);
        setLOADING(false);
        return;
      } else {
        handleSnakBarOpen();
        setalertType("error");
        setalertMsg("Something went Wrong! Please Try Again");
        setLOADING(false);
        return;
      }
    } else {
      if (type === 3) {
        let transectionData = {
          user_id: userId,
          amount: orderAmount,
          payment_id: "xxx",
          type: 2,
          description: "Amount paid",
          payment_mode: paymentMode,
        };
        let TransecUrl = `${api}/add_order_txn`;
        const transectionID = await ADD(token, TransecUrl, transectionData);
        if (transectionID.response === 200) {
          const data = {
            user_id: userId,
            product_id: productId,
            order_amount: (orderAmount * quantity).toFixed(2),
            start_date: date,
            qty: quantity,
            address_id: addressID,
            subscription_type: subsType,
            status: status,
            order_status: order_status,
            order_type: type,
            selected_days_for_weekly:
              subsType === 2 ? selectDays().string : null,
            price: price,
            mrp: MRP,
            tax: tax,
            trasation_id: transectionID.id,
          };

          const url = `${api}/add_order`;

          const add = await ADD(token, url, data);
          setLOADING(false);
          if (add.response === 200) {
            handleSnakBarOpen();
            setalertType("success");
            setalertMsg("New Order Added successfully");
            setTimeout(() => {
              navigate("/Orders");
            }, 1000);
          } else if (add.response === 201) {
            handleSnakBarOpen();
            setalertType("error");
            setalertMsg(add.message);
          } else {
            handleSnakBarOpen();
            setalertType("error");
            setalertMsg("Something went Wrong! Please Try Againn");
          }
        } else {
          handleSnakBarOpen();
          setalertType("error");
          setalertMsg("Something went Wrong! Please Try Againn");
        }
      } else {
        const data = {
          user_id: userId,
          product_id: productId,
          order_amount: (orderAmount * quantity).toFixed(2),
          start_date: date,
          qty: quantity,
          address_id: addressID,
          subscription_type: subsType,
          status: status,
          order_status: order_status,
          order_type: type,
          selected_days_for_weekly: subsType === 2 ? selectDays().string : null,
          price: price,
          mrp: MRP,
          tax: tax,
        };

        const url = `${api}/add_order`;
        const add = await ADD(token, url, data);
        setLOADING(false);
        if (add.response === 200) {
          handleSnakBarOpen();
          setalertType("success");
          setalertMsg("New Order Added successfully");
          setTimeout(() => {
            navigate("/Orders");
          }, 1000);
        } else if (add.response === 201) {
          handleSnakBarOpen();
          setalertType("error");
          setalertMsg(add.message);
        } else {
          handleSnakBarOpen();
          setalertType("error");
          setalertMsg("Something went Wrong! Please Try Againn");
        }
      }
    }
  };

  const getAddress = async (userID) => {
    const url = `${api}/address/user/${userID}`;
    const add = await GET(token, url);
    if (add.response === 200) {
      setaddress(add.data);
    } else if (add.response === 201) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(add.message);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  return (
    <>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "10px",
          borderBottom: colors.grey[300],
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => {
              navigate("/Products");
            }}
          >
            <ArrowBackIcon />
          </IconButton>{" "}
          <h2 className="heading"> Add New Order</h2>
        </div>
      </Box>
      <Box component="form" onSubmit={addOrder}>
        <div className="product">
          <div
            className="left"
            style={{
              backgroundColor: colors.cardBG[400],
            }}
          >
            <h2>Order Details</h2>
            <p>
              Enter the required information below . You can change it anytime
              you want.
            </p>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              gap="20px"
              mt="20px"
            >
              <Autocomplete
                disablePortal
                fullWidth
                id="combo-box-demo"
                color="secondary"
                options={users}
                onChange={(e, data) => {
                  setuserId(data.id);
                  getAddress(data.id);
                }}
                getOptionLabel={(option) =>
                  `${option?.name}   (${
                    option?.phone ? option?.phone : option?.email
                  })` || ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    size="small"
                    fullWidth
                    required
                    color="secondary"
                  />
                )}
              />

              <Autocomplete
                disablePortal
                fullWidth
                id="combo-box-demo"
                color="secondary"
                options={products}
                onChange={(e, data) => {
                  setisProductSubsType(data.subscription);
                  setproductId(data.id);
                  setprice(data.price);
                  setMRP(data.mrp);
                  settax(data.tax);
                  setorderAmount((data.price * data.tax) / 100 + data.price);
                }}
                getOptionLabel={(option) =>
                  `${option?.title} (${option?.qty_text}) ${
                    option?.subscription === 1 ? "( Subcription )" : ""
                  }` || ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product"
                    size="small"
                    sx={{ fontSize: "12px" }}
                    fullWidth
                    required
                    color="secondary"
                  />
                )}
              />
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              gap="20px"
              mt="20px"
            >
              <TextField
                margin="normal"
                disabled
                required
                fullWidth
                id="MRP"
                label="MRP"
                name="MRP"
                type="number"
                color="secondary"
                autoComplete="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={MRP}
              />
              <TextField
                margin="normal"
                required
                disabled
                fullWidth
                id="Price"
                label="Price"
                name="Price"
                type="number"
                color="secondary"
                autoComplete="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={price}
              />
              <TextField
                margin="normal"
                required
                disabled
                fullWidth
                id="Tax"
                label="Tax"
                name="Tax"
                type="number"
                color="secondary"
                autoComplete="number"
                size="small"
                InputProps={{ inputProps: { min: 0 } }}
                value={tax}
              />
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              gap="20px"
              mt="20px"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="Order Amount"
                label="Order Amount"
                name="Order Amount"
                type="number"
                color="secondary"
                autoComplete="number"
                size="small"
                disabled
                value={(orderAmount * quantity).toFixed(2)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="Order Amount"
                label="Quantity"
                name="Quantity"
                type="number"
                color="secondary"
                autoComplete="number"
                size="small"
                InputProps={{ inputProps: { min: 1 } }}
                value={quantity}
                onChange={(e) => {
                  setquantity(
                    e.target.value === "" ? "" : Math.floor(e.target.value)
                  );
                }}
              />
              <TextField
                disabled={isProductSubsType === 0}
                margin="normal"
                required
                fullWidth
                id="Start From"
                label="Start From"
                name="Start From"
                type="date"
                color="secondary"
                size="small"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: { min: today },
                }}
                onChange={(e) => {
                  setdate(e.target.value);
                }}
              />
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              gap="20px"
              mt="30px"
            >
              <FormControl fullWidth disabled={isProductSubsType === 0}>
                <InputLabel
                  id="demo-simple-select-label"
                  color="secondary"
                  size="small"
                >
                  Subscription Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Subscription Type"
                  size="small"
                  fullWidth
                  color="secondary"
                  onChange={(e) => {
                    setsubsType(e.target.value);
                  }}
                >
                  <MenuItem value={1}>Daliy</MenuItem>
                  <MenuItem value={2}>Weekly</MenuItem>
                  <MenuItem value={3}>Monthly</MenuItem>
                  <MenuItem value={4}>Alternative days</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="address-select" color="secondary" size="small">
                  Address
                </InputLabel>
                <Select
                  disabled={!userId}
                  labelId="address-select"
                  id="demo-simple-select"
                  label="Address"
                  size="small"
                  fullWidth
                  color="secondary"
                  onChange={(e) => {
                    if (e.target.value === 0) {
                      setaddressID();
                      setaddnew(true);
                    } else {
                      setaddnew(false);
                      setaddressID(e.target.value);
                    }
                  }}
                >
                  <MenuItem value={0}>Add New Address</MenuItem>
                  <br />
                  {address?.map((ad) => (
                    <MenuItem
                      value={ad.id}
                    >{`${ad.flat_no} , ${ad.apartment_name} , ${ad.area} , ${ad.landmark} , ${ad.city} , ${ad.pincode}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              display={"flex"}
              alignItems="center"
              justifyContent={"space-between"}
              gap="20px"
              mt="30px"
            >
              {/* Select */}
              <Box flex={1}>
                {" "}
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    color="secondary"
                    size="small"
                  >
                    Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Status"
                    size="small"
                    fullWidth
                    color="secondary"
                    onChange={(e) => {
                      setstatus(e.target.value);
                    }}
                  >
                    <MenuItem value={1}>Confirmed</MenuItem>
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={2}>Canceled</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {isProductSubsType === 1 ? (
                <>
                  {" "}
                  {/* check Boxes */}
                  <Box
                    display={"flex"}
                    alignItems="center"
                    gap="50px"
                    mt="20px"
                    flex={"1"}
                    justifyContent={
                      isProductSubsType === 1 ? "flex-end" : "flex-start"
                    }
                  >
                    <Box>
                      <Typography fontWeight={"600"} fontSize={"18x"}>
                        Order Status *
                      </Typography>
                      <Box display={"flex"} alignItems="center" gap="10px">
                        <Typography fontSize={"16px"} fontWeight={"600"}>
                          Stop
                        </Typography>
                        <div class="toggle-switch">
                          <input
                            class="toggle-input"
                            id="toggle1"
                            type="checkbox"
                            checked={order_status === 0}
                            onChange={() => {
                              setorder_status(order_status === 1 ? 0 : 1);
                            }}
                          />
                          <label class="toggle-label-2" for="toggle1"></label>
                        </div>
                        <Typography fontSize={"16px"} fontWeight={"600"}>
                          Active
                        </Typography>
                      </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* Order Type */}
                    <Box>
                      <Typography fontWeight={"600"} fontSize={"18x"}>
                        Order Type *
                      </Typography>
                      <Box display={"flex"} alignItems="center" gap="10px">
                        <Typography fontSize={"16px"} fontWeight={"600"}>
                          Prepaid
                        </Typography>
                        <div class="toggle-switch">
                          <input
                            class="toggle-input"
                            id="toggle2"
                            type="checkbox"
                            checked={type === 2}
                            onChange={() => {
                              settype(type === 1 ? 2 : 1);
                            }}
                            disabled
                
                          />
                          <label
                            class="toggle-label-2"
                            for="toggle2"
                            disabled
                            style={{ cursor: "not-allowed" }}
                          ></label>
                        </div>
                        <Typography fontSize={"16px"} fontWeight={"600"}>
                          Postpaid
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  {" "}
                  {/* Select */}
                  <Box display={"flex"} flex={1} gap={"10px"}>
                    {" "}
                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        color="secondary"
                        size="small"
                      >
                        Order Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Order Type"
                        size="small"
                        fullWidth
                        color="secondary"
                        onChange={(e) => {
                          settype(e.target.value);
                        }}
                      >
                        <MenuItem value={3}>Pay Now</MenuItem>
                        <MenuItem value={4}>Pay Leter</MenuItem>
                      </Select>
                    </FormControl>
                    {type === 3 && (
                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-simple-select-label"
                          color="secondary"
                          size="small"
                        >
                          Payment Mode
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Payment Mode"
                          size="small"
                          fullWidth
                          color="secondary"
                          value={paymentMode}
                          onChange={(e) => {
                            setpaymentMode(e.target.value);
                          }}
                        >
                          <MenuItem value={1}>Online</MenuItem>
                          <MenuItem value={2}>Cash</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </>
              )}
            </Box>
            {subsType === 2 && (
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
                gap="20px"
                mt="20px"
              >
                <Box width={"fir-content"}>
                  <Typography mt={3}>Select Delivery Days *</Typography>
                  <Stack direction="row" spacing={2} mt={1}>
                    <div
                      className={M === 1 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setM(M ? null : 1);
                      }}
                    >
                      M
                    </div>
                    <div
                      className={T === 2 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setT(T ? null : 2);
                      }}
                    >
                      T
                    </div>
                    <div
                      className={W === 3 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setW(W ? null : 3);
                      }}
                    >
                      W
                    </div>
                    <div
                      className={TH === 4 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setTH(TH ? null : 4);
                      }}
                    >
                      TH
                    </div>
                    <div
                      className={F === 5 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setF(F ? null : 5);
                      }}
                    >
                      F
                    </div>
                    <div
                      className={S === 6 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setS(S ? null : 6);
                      }}
                    >
                      S
                    </div>
                    <div
                      className={SU === 0 ? "dayBTn active" : "dayBTn"}
                      onClick={() => {
                        setSU(SU === 1 ? 0 : 1);
                      }}
                    >
                      SU
                    </div>
                  </Stack>
                  <Typography mt={3}>Set Per Day Quality *</Typography>
                  <Stack direction="column" spacing={2} mt={1}>
                    {selected_days.map(
                      (s) =>
                        s.d === s.id && (
                          <div className="dayQty">
                            <p style={{ fontWeight: "600" }}>{s.name}</p>
                            <div className="qty">
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label="add an alarm"
                                sx={{
                                  border: "1px solid #000",
                                  padding: "2px",
                                }}
                                onClick={s.remove}
                              >
                                <RemoveIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                              <b>
                                {" "}
                                <p>{s.qt}</p>
                              </b>
                              <IconButton
                                size="small"
                                color="secondary"
                                aria-label="add an alarm"
                                sx={{
                                  border: "1px solid #4cceac",
                                  padding: "3px",
                                }}
                                onClick={s.add}
                              >
                                <AddIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </div>
                          </div>
                        )
                    )}
                  </Stack>
                </Box>
              </Box>
            )}
          </div>
        </div>
        {addnew && (
          <div className="product">
            <div
              className="left"
              style={{
                backgroundColor: colors.cardBG[400],
              }}
            >
              <h2>Add New Address</h2>
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
                gap="20px"
                mt="20px"
              >
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Name "
                  label="Name "
                  name="Name "
                  type="text"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Phone Number"
                  label="Phone Number"
                  name="Phone Number"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setnumber(e.target.value);
                  }}
                />
              </Box>
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
                gap="20px"
                mt="20px"
              >
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Flat "
                  label="Flat "
                  name="Flat "
                  type="text"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setflat(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Apartment_name"
                  label="Apartment name"
                  name="Apartment_name"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setapartment(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Area"
                  label="Area"
                  name="Area"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setarea(e.target.value);
                  }}
                />
              </Box>
              <Box
                display={"flex"}
                alignItems="center"
                justifyContent={"space-between"}
                gap="20px"
                mt="20px"
              >
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Landmark "
                  label="Landmark "
                  name="Landmark "
                  type="text"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setlandmark(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="City"
                  label="City"
                  name="City"
                  color="secondary"
                  size="small"
                  onChange={(e) => {
                    setcity(e.target.value);
                  }}
                />
                <TextField
                  margin="normal"
                  required={addnew}
                  fullWidth
                  id="Pincode"
                  label="Pincode"
                  name="Pincode"
                  color="secondary"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxlength: "8",
                  }}
                  size="small"
                  onChange={(e) => {
                    setpincode(e.target.value);
                  }}
                />
              </Box>
            </div>
          </div>
        )}

        <div className="delete">
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ fontWeight: "600", letterSpacing: "1px" }}
          >
            {LOADING ? <CircularProgress size={20} /> : "Add New Order"}
          </Button>
        </div>
      </Box>
    </>
  );
}

export default NewOrder;
