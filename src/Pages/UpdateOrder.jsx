/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Modal,
} from "@mui/material";
import { Stack } from "@mui/system";
import Skeleton from "@mui/material/Skeleton";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import "../Styles/product.css";
import TextField from "@mui/material/TextField";
import api from "./../Data/api";
import { ADD, DELETE, GET, UPDATE } from "../Functions/apiFunction";
import { tokens } from "../theme";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";

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
  overflow: "scroll",
};

function UpdateOrder() {
  const products = useSelector((state) => {
    return state.Products[state.Products.length - 1];
  });
  const users = useSelector((state) => {
    return state.Users[state.Users.length - 1];
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const param = useParams();

  // delivery details
  const [delivery, setdelivery] = useState();
  const [orderAssign, setorderAssign] = useState();
  const [selcetedDaysForWeekly, setselectedDaysForWeekly] = useState();

  //
  const [transactionHistory, settransactionHistory] = useState();
  const [pageSize, setpageSize] = useState(20);
  const [pageSize2, setpageSize2] = useState(20);
  const [pageSize3, setpageSize3] = useState(20);
  const [userId, setuserId] = useState();
  const [productId, setproductId] = useState();
  const [orderAmount, setorderAmount] = useState();
  const [date, setdate] = useState();
  const [addressID, setaddressID] = useState();
  const [quantity, setquantity] = useState();
  const [subsType, setsubsType] = useState();
  const [status, setstatus] = useState();
  const [order_status, setorder_status] = useState();
  const [dlvStatus, setdlvStatus] = useState();

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

  const [reFetch, setreFetch] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [assignID, setassignID] = useState();
  const [delivryBoyz, setdelivryBoyz] = useState();
  const [selectedBoy, setselectedBoy] = useState();

  const [loading, setloading] = useState(false);
  const [DailogOpen, setDailogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addDelvryModal, setaddDelvryModal] = useState(false);
  const handleDailogOpen = () => {
    setDailogOpen(true);
  };

  const handleDailogClose = () => {
    setDailogOpen(false);
  };
  const handleaddDekiveryDailogOpen = () => {
    setaddDelvryModal(true);
  };

  const handleaddDekiveryDailogClose = () => {
    setaddDelvryModal(false);
  };

  // add new order date
  const [addDlvryDate, setaddDlvryDate] = useState();

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
    for (let index = 0; index < selected_days?.length; index++) {
      if (selected_days[index].d !== undefined) {
        arr.push({
          dayCode: selected_days[index].d,
          qty: selected_days[index].qt,
        });
      }
    }
    let string = "";

    for (let i = 0; i < arr?.length; i++) {
      const obj = arr[i];
      string += `{dayCode:${obj.dayCode}, qty:${obj.qty}},`;
    }
    string = `[${string.slice(0, -1)}]`;
    return {
      arr: arr,
      string: string,
    };
  };

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  useEffect(() => {
    const getOrder = async () => {
      const url = `${api}/get_order/${param.id}`;
      const orders = await GET(token, url);
      const order = orders.data;
      getAddress(order.user_id, order.address_id);
      setuserId(order.user_id);
      setname(order.name);
      setproductId(order.product_id);

      setquantity(order.qty);
      setdate(order.start_date);
      setsubsType(order.subscription_type);
      setaddressID(order.address_id);
      setstatus(order.status);
      setorder_status(order.order_status);
      setdlvStatus(order.delivery_status);
      setselectedDaysForWeekly(order.selected_days_for_weekly);

      const product = products?.find((option) => {
        return order.product_id === option.id;
      });
      setorderAmount((product.price * product.tax) / 100 + product.price);
      // eslint-disable-next-line no-eval
      const selected_days = eval(order.selected_days_for_weekly);

      if (order.selected_days_for_weekly) {
        for (let index = 0; index < selected_days?.length; index++) {
          const element = selected_days[index];
          const val = element.dayCode;
          switch (val) {
            case 1:
              setM(element.dayCode);
              setM_QT(element.qty);
              break;
            case 2:
              setT(element.dayCode);
              setT_QT(element.qty);
              break;
            case 3:
              setW(element.dayCode);
              setW_QT(element.qty);
              break;
            case 4:
              setTH(element.dayCode);
              setTH_QT(element.qty);
              break;
            case 5:
              setF(element.dayCode);
              setF_QT(element.qty);
              break;
            case 6:
              setS(element.dayCode);
              setS_QT(element.qty);
              break;
            case 0:
              setSU(element.dayCode);
              setSU_QT(element.qty);
              break;
            default:
              return;
          }
        }
      }

      if (order.subscription_type === null) {
        const url = `${api}/txn/order/${order.id}`;
        getTrans(url);
      } else {
        const url = `${api}/txn/sub_order/${order.id}`;
        getTrans(url);
      }
    };
    const getDelevery = async () => {
      const url = `${api}/get_sub_order_delivery/order/${param.id}`;
      const dvlries = await GET(token, url);
      const dlvry = dvlries.data;
      setdelivery(dlvry);
    };

    getOrder();
    getDelevery();
  }, [param.id, token, reFetch]);

  useEffect(() => {
    const assign = async () => {
      const url = `${api}/get_assign_user_order/order/${param.id}`;
      const ordrAssign = await GET(token, url);
      setorderAssign(ordrAssign?.data);
    };
    const delivryBoyz = async () => {
      const url = `${api}/get_user/role/4`;
      const boys = await GET(token, url);
      setdelivryBoyz(boys?.data);
    };
    assign();
    delivryBoyz();
  }, [reFetch]);

  // const getTransc
  const getTrans = async (url) => {
    const transc = await GET(token, url);
    settransactionHistory(transc?.data);
  };

  // add order
  const updateSubs = async (e) => {
    e.preventDefault();
    if (subsType === 2 && !selectDays().arr?.length) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Please Select Delivery Days  and Per Day Quality");
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
        const data = {
          id: param.id,
          order_amount: (orderAmount * quantity).toFixed(2),
          start_date: date,
          qty: quantity,
          address_id: address.id,
          status: status,
          order_status: order_status,
        };
        const url = `${api}/update_order`;

        const add = await UPDATE(token, url, data);
        setLOADING(false);
        if (add.response === 200) {
          handleSnakBarOpen();
          setalertType("success");
          setalertMsg("Order Updated");
          setreFetch(!reFetch);
          setaddnew(false);
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
      const data = {
        id: param.id,
        order_amount: (orderAmount * quantity).toFixed(2),
        start_date: date,
        qty: quantity,
        address_id: addressID,
        status: status,
        order_status: order_status,
      };
      const url = `${api}/update_order`;

      const add = await UPDATE(token, url, data);
      setLOADING(false);
      if (add.response === 200) {
        handleSnakBarOpen();
        setalertType("success");
        setalertMsg("Order Updated");
        setreFetch(!reFetch);
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
  };
  const updateNormal = async (e) => {
    e.preventDefault();
    if (subsType === 2 && !selectDays().arr?.length) {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Please Select Delivery Days  and Per Day Quality");
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
        const data = {
          id: param.id,
          qty: quantity,
          order_amount: (orderAmount * quantity).toFixed(2),
          address_id: address.id,
          status: status,
        };
        const url = `${api}/update_order`;

        const add = await UPDATE(token, url, data);
        setLOADING(false);
        if (add.response === 200) {
          handleSnakBarOpen();
          setalertType("success");
          setalertMsg("Order Updated");
          setreFetch(!reFetch);
          setaddnew(false);
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
      const data = {
        id: param.id,
        qty: quantity,
        order_amount: (orderAmount * quantity).toFixed(2),
        address_id: addressID,
        status: status,
      };
      const url = `${api}/update_order`;

      const add = await UPDATE(token, url, data);
      setLOADING(false);
      if (add.response === 200) {
        handleSnakBarOpen();
        setalertType("success");
        setalertMsg("Order Updated");
        setreFetch(!reFetch);
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
  };

  // get address
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

  // ass assign
  const addAssign = async () => {
    const url = `${api}/add_order_assign`;
    const data = {
      user_id: selectedBoy,
      order_id: param.id,
    };
    setisUpdating(true);
    const assignAdd = await ADD(token, url, data);
    if (assignAdd.response === 200) {
      setisUpdating(false);
      handleClose();
      handleSnakBarOpen();
      setreFetch(!reFetch);
      setalertType("success");
      setalertMsg("Order assign successfully");
    } else if (assignAdd.response === 201) {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(assignAdd.message);
    } else {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // Delete Assign
  const DeleteAssign = async () => {
    const url = `${api}/order_assign/delete`;
    const data = {
      id: assignID,
    };
    setloading(true);
    const dltProdct = await DELETE(token, url, data);
    setloading(false);
    if (dltProdct.response === 200) {
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("Successfully Deleted");
      handleDailogClose();
      setreFetch(!reFetch);
    } else {
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
      handleDailogClose();
    }
  };

  // ass assign
  const addDelivery = async () => {
    const url = `${api}/add_sub_order_delivery/add_manually`;
    const data = {
      entry_user_id: selectedBoy,
      order_id: param.id,
      date: addDlvryDate,
    };
    setisUpdating(true);
    const assignAdd = await ADD(token, url, data);
    if (assignAdd.response === 200) {
      setisUpdating(false);
      handleaddDekiveryDailogClose();
      handleSnakBarOpen();
      setreFetch(!reFetch);
      setalertType("success");
      setalertMsg("Delivery Added successfully");
    } else if (assignAdd.response === 201) {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(assignAdd.message);
    } else {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // addd weekly dlvry
  const addWeeklyDelivery = async () => {
    const url = `${api}/add_sub_order_delivery_weekly/add_manually`;
    const data = {
      entry_user_id: selectedBoy,
      order_id: param.id,
      date: addDlvryDate,
      qty: getQty(addDlvryDate).qty,
    };
    setisUpdating(true);
    const assignAdd = await ADD(token, url, data);
    if (assignAdd.response === 200) {
      setisUpdating(false);
      handleaddDekiveryDailogClose();
      handleSnakBarOpen();
      setreFetch(!reFetch);
      setalertType("success");
      setalertMsg("Delivery Added successfully");
    } else if (assignAdd.response === 201) {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg(assignAdd.message);
    } else {
      setisUpdating(false);
      handleSnakBarOpen();
      setalertType("error");
      setalertMsg("Something went Wrong! Please Try Again");
    }
  };

  // tables
  const column = useMemo(
    () => [
      { field: "entry_user_id", headerName: "Delivery User Id", width: 170 },
      { field: "name", headerName: "Name", width: 200 },

      { field: "phone", headerName: "Phone Number", width: 150 },
      { field: "email", headerName: "Email", width: 180 },
      { field: "date", headerName: "Delivery Date", width: 180 },
      { field: "created_at", headerName: "Time Stamps", width: 180 },

      {
        field: "payment_mode",
        headerName: "Payment Mode",
        width: 100,
        renderCell: (params) => (
          <p>
            {params.row.payment_mode === null
              ? "N/A"
              : params.row.payment_mode === 1
              ? "Online"
              : params.row.payment_mode === 2
              ? "Offline"
              : "N/A"}
          </p>
        ),
      },
    ],
    []
  );
  const assignColumn = useMemo(
    () => [
      { field: "user_id", headerName: "Id", width: 200 },
      { field: "name", headerName: "Name", width: 200 },
      { field: "phone", headerName: "Phone Number", width: 150 },
      { field: "email", headerName: "Email", width: 180 },
      { field: "created_at", headerName: "Date & Time", width: 180 },
      {
        field: "Action",
        headerName: "Action",
        width: 100,
        renderCell: (params) => (
          <button
            class="dltBtn"
            onClick={(e) => {
              e.preventDefault();
              setassignID(params.row.id);
              handleDailogOpen();
            }}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        ),
      },
    ],
    []
  );
  const transactionColumn = useMemo(
    () => [
      {
        field: "payment_id",
        headerName: "Payment Id",
        width: 200,
        renderCell: (params) => (
          <p>
            {params.row.payment_id === null ? "N/A" : params.row.payment_id}
          </p>
        ),
      },
      {
        field: "type",
        headerName: "Payment Type",
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
        field: "payment_mode",
        headerName: "Payment Mode",
        width: 100,
        renderCell: (params) => (
          <p>
            {params.row.payment_mode === 1
              ? "Online"
              : params.row.payment_mode === 2
              ? "Cash"
              : ""}
          </p>
        ),
      },
      { field: "amount", headerName: "Amount", width: 120 },

      { field: "created_at", headerName: "Date & Time", width: 180 },
    ],
    []
  );

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
        {product && product?.subscription === 1 ? (
          <button
            class="cssbuttons-io-button"
            onClick={(e) => {
              e.preventDefault();
              setselectedBoy();
              handleaddDekiveryDailogOpen();
            }}
          >
            {" "}
            Assign New
            <div class="icon">
              <i class="fa-regular fa-plus"></i>
            </div>
          </button>
        ) : (
          ""
        )}
      </GridToolbarContainer>
    );
  }
  // custom toolbar
  function transecToolbar() {
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
            value={pageSize2}
            label="Page Size"
            onChange={(e) => {
              setpageSize2(e.target.value);
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
  function assignToolbar() {
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
            value={pageSize3}
            label="Page Size"
            onChange={(e) => {
              setpageSize3(e.target.value);
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
          onClick={(e) => {
            e.preventDefault();
            setselectedBoy();
            handleOpen();
          }}
        >
          {" "}
          Assign New
          <div class="icon">
            <i class="fa-regular fa-plus"></i>
          </div>
        </button>
      </GridToolbarContainer>
    );
  }

  const product = products?.find((option) => {
    return productId === option.id;
  });

  const getQty = (date) => {
    const dayCode = getDayName(date);
    const string = selcetedDaysForWeekly;
    const validJSONString = string.replace(
      /(['"])?([a-zA-Z0-9_]+)(['"])?:/g,
      '"$2": '
    );
    const array = JSON.parse(validJSONString);
    const containsDayQty = array.find((obj) => obj.dayCode === dayCode);

    return containsDayQty;
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
          alignItems: "center",
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
              navigate("/Orders");
            }}
          >
            <ArrowBackIcon />
          </IconButton>{" "}
          <h2 className="heading"> Update Order Details</h2>
        </div>
        {subsType === null && dlvStatus === 1 && (
          <div
            style={{
              padding: "3px 10px",
              background: "#28a745",
              color: "#f6f6f6",
              borderRadius: "10px",
              fontSize: "14px",
            }}
          >
            Order Delivered{" "}
            <span style={{ marginLeft: "5px" }}>
              <i class="fa-regular fa-thumbs-up"></i>
            </span>
          </div>
        )}
      </Box>
      {userId ? (
        <Box
          component="form"
          onSubmit={(e) => {
            if (subsType === null) {
              updateNormal(e);
            } else {
              updateSubs(e);
            }
          }}
        >
          <div className="product">
            <div
              className="left"
              style={{
                backgroundColor: colors.cardBG[400],
                maxWidth: "100%",
              }}
            >
              <h2>
                Order Details <span>#{param.id}</span>
              </h2>
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
                  disabled
                  fullWidth
                  id="combo-box-demo"
                  color="secondary"
                  options={users}
                  inputValue={name}
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
                  disabled
                  id="combo-box-demo"
                  color="secondary"
                  options={products}
                  value={
                    productId
                      ? products?.find((option) => {
                          return productId === option.id;
                        }) ?? null
                      : null
                  }
                  onChange={(e, data) => {
                    setproductId(data.id);
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
                  id="Order Amount"
                  label="Order Amount"
                  name="Order Amount"
                  type="number"
                  color="secondary"
                  autoComplete="number"
                  size="small"
                  InputProps={{ inputProps: { min: 0 } }}
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
                  InputProps={{ inputProps: { min: 0 } }}
                  value={quantity}
                  onChange={(e) => {
                    setquantity(
                      e.target.value === "" ? "" : Math.floor(e.target.value)
                    );
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  disabled={subsType === null}
                  fullWidth
                  id="Start From"
                  label="Start From"
                  name="Start From"
                  type="date"
                  color="secondary"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={date}
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
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    color="secondary"
                    size="small"
                  >
                    Subscription Type
                  </InputLabel>
                  <Select
                    disabled
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Subscription Type"
                    size="small"
                    fullWidth
                    required={subsType != null}
                    color="secondary"
                    onChange={(e) => {
                      setsubsType(e.target.value);
                    }}
                    value={subsType}
                  >
                    <MenuItem value={1} selected>
                      Daliy
                    </MenuItem>
                    <MenuItem value={2}>Weekly</MenuItem>
                    <MenuItem value={3}>Monthly</MenuItem>
                    <MenuItem value={4}>Alternative days</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel
                    id="address-select"
                    color="secondary"
                    size="small"
                  >
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
                    value={addressID}
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
              {/* toggle btns */}
              {/* Order Status */}
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
                      value={status}
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

                {/* check Boxes */}
                <Box
                  display={"flex"}
                  alignItems="center"
                  gap="50px"
                  mt="20px"
                  flex={"1"}
                  justifyContent={subsType != null && "flex-start"}
                >
                  {subsType != null && (
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
                  )}

                  <Divider orientation="vertical" flexItem />
                </Box>
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
                      <div className={M === 1 ? "dayBTn active" : "dayBTn"}>
                        M
                      </div>
                      <div className={T === 2 ? "dayBTn active" : "dayBTn"}>
                        T
                      </div>
                      <div className={W === 3 ? "dayBTn active" : "dayBTn"}>
                        W
                      </div>
                      <div className={TH === 4 ? "dayBTn active" : "dayBTn"}>
                        TH
                      </div>
                      <div className={F === 5 ? "dayBTn active" : "dayBTn"}>
                        F
                      </div>
                      <div className={S === 6 ? "dayBTn active" : "dayBTn"}>
                        S
                      </div>
                      <div className={SU === 0 ? "dayBTn active" : "dayBTn"}>
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
                <Box
                  display={"flex"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  gap="20px"
                  mt="20px"
                ></Box>
              </div>
            </div>
          )}

          <div className="product">
            <div
              className="left"
              style={{
                backgroundColor: colors.cardBG[400],
              }}
            >
              <h3>Delivery Details</h3>
              <Box sx={{ height: 400, width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  {" "}
                </div>

                {delivery && (
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
                      rows={delivery ? delivery : []}
                      components={{ Toolbar: CustomToolbar }}
                      rowsPerPageOptions={[10, 20, 25, 50, 100]}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) =>
                        setpageSize(newPageSize)
                      }
                    />
                  </Box>
                )}
              </Box>
            </div>
          </div>

          {/* transection */}
          <div className="product">
            <div
              className="left"
              style={{
                backgroundColor: colors.cardBG[400],
              }}
            >
              <h3>Transaction History </h3>
              <Box sx={{ height: 400, width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  {" "}
                </div>

                {transactionHistory ? (
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
                      columns={transactionColumn}
                      rows={transactionHistory ? transactionHistory : []}
                      components={{ Toolbar: transecToolbar }}
                      rowsPerPageOptions={[10, 20, 25, 50, 100]}
                      pageSize={pageSize2}
                      onPageSizeChange={(newPageSize) =>
                        setpageSize2(newPageSize)
                      }
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
          </div>
          <div className="product">
            <div
              className="left"
              style={{
                backgroundColor: colors.cardBG[400],
              }}
            >
              <h3>Assign orders </h3>
              <Box sx={{ height: 400, width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row-reverse",
                  }}
                >
                  {" "}
                </div>

                {delivery && (
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
                      columns={assignColumn}
                      rows={orderAssign ? orderAssign : []}
                      components={{ Toolbar: assignToolbar }}
                      rowsPerPageOptions={[10, 20, 25, 50, 100]}
                      pageSize={pageSize3}
                      onPageSizeChange={(newPageSize) =>
                        setpageSize3(newPageSize)
                      }
                    />
                  </Box>
                )}
              </Box>
            </div>
          </div>

          <div className="delete">
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ fontWeight: "600", letterSpacing: "1px" }}
            >
              {LOADING ? <CircularProgress size={20} /> : "Update Order"}
            </Button>
          </div>
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

      {/* model */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Assign order to delivery partner
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Autocomplete
              disablePortal
              fullWidth
              id="combo-box-demo"
              color="secondary"
              options={delivryBoyz}
              onChange={(e, data) => setselectedBoy(data.user_id)}
              getOptionLabel={(option) =>
                `${option?.name} , ${option?.email} , ${option?.phone}` || ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Delivery Partner"
                  size="small"
                  fullWidth
                  required
                  color="secondary"
                />
              )}
            />

            <button
              className="AddBtn"
              disabled={isUpdating}
              onClick={(e) => {
                e.preventDefault();
                if (!selectedBoy) {
                  handleSnakBarOpen();
                  setalertType("error");
                  setalertMsg("Please Select Delivery Partner");
                } else {
                  addAssign();
                }
              }}
            >
              {isUpdating ? <CircularProgress color="inherit" /> : "Assign"}
            </button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={addDelvryModal}
        onClose={handleaddDekiveryDailogClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add Delivery
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Autocomplete
              disablePortal
              fullWidth
              id="combo-box-demo"
              color="secondary"
              options={orderAssign}
              onChange={(e, data) => setselectedBoy(data.user_id)}
              getOptionLabel={(option) =>
                `${option?.name} , ${option?.email} , ${option?.phone}` || ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Delivery Partner"
                  size="small"
                  fullWidth
                  required
                  color="secondary"
                />
              )}
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Delivery Date"
                onChange={(value) => {
                  setaddDlvryDate(moment(value.$d).format("YYYY-MM-DD"));
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <button
              className="AddBtn"
              disabled={isUpdating}
              onClick={(e) => {
                e.preventDefault();
                if (!selectedBoy) {
                  handleSnakBarOpen();
                  setalertType("error");
                  setalertMsg("Please Select Delivery Partner");
                } else {
                  if (subsType !== 2) {
                    addDelivery();
                  } else if (subsType === 2) {
                    addWeeklyDelivery();
                  }
                }
              }}
            >
              {isUpdating ? <CircularProgress color="inherit" /> : "Add"}
            </button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        open={DailogOpen}
        onClose={handleDailogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>Do You Want to Remove </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDailogClose}
            variant="contained"
            color="secondary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={DeleteAssign}
            autoFocus
            variant="contained"
            color="error"
            size="small"
          >
            {loading ? <CircularProgress /> : "Yes! Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UpdateOrder;
