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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@mui/material/styles";
import "../Styles/product.css";
import { PhotoCamera } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import api from "./../Data/api";
import { ADD, UPLOAD } from "../Functions/apiFunction";
import { tokens } from "../theme";

function AddProduct() {
  const subCateg = useSelector((state) => {
    return state.subCategory[state.subCategory.length - 1];
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [title, settitle] = useState("");
  const [quantity, setquantity] = useState("");
  const [price, setprice] = useState(0);
  const [MRP, setMRP] = useState(0);
  const [tax, settax] = useState();
  const [stock, setstock] = useState(1);
  const [subCat, setsubCat] = useState("");
  const [offer, setoffer] = useState("");
  const [desc, setdesc] = useState("");
  const [claimer, setclaimer] = useState("");
  const [subs, setsubs] = useState(0);
  const [img, setimg] = useState();
  const [LOADING, setLOADING] = useState(false);
  const [snakbarOpen, setsnakbarOpen] = useState(false);
  const [alertType, setalertType] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [uploadImage, setuploadImage] = useState();
  const [imgType, setimgType] = useState();

  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin.token}`;

  const handleSnakBarOpen = () => setsnakbarOpen(true);
  const handleSnakBarClose = () => setsnakbarOpen(false);

  const addProduct = async (e) => {
    e.preventDefault();
    const data = {
      title: title,
      qty_text: quantity,
      sub_cat_id: subCat,
      price: price,
      tax: tax,
      mrp: MRP,
      offer_text: offer,
      description: desc,
      disclaimer: claimer,
      subscription: subs,
      stock_qty: stock,
    };

    const url = `${api}/add_product`;
    setLOADING(true);
    const add = await ADD(token, url, data);
    setLOADING(false);
    if (add.response === 200) {
      if (uploadImage) {
        let UploadUrl = `${api}/product/upload_image`;
        const uploadData = {
          image: uploadImage,
          image_type: imgType,
          id: add.id,
        };
        await UPLOAD(token, UploadUrl, uploadData);
      }
      handleSnakBarOpen();
      setalertType("success");
      setalertMsg("New Product Added successfully");
      setTimeout(() => {
        navigate("/Products");
      }, 1000);
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
          <h2 className="heading"> Add New Product</h2>
        </div>
      </Box>
      <Box component="form" onSubmit={addProduct}>
        <div className="product">
          <div
            className="left"
            style={{
              backgroundColor: colors.cardBG[400],
            }}
          >
            <h2>Product Information</h2>
            <p>
              Enter the required information below . You can change it anytime
              you want.
            </p>
            <TextField
              margin="normal"
              required
              color="secondary"
              fullWidth
              id="Title"
              label="Title"
              name="Title"
              autoComplete="text"
              size="small"
              placeholder="Title"
              onChange={(e) => {
                settitle(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              color="secondary"
              fullWidth
              id="Quantity"
              label="Quantity"
              name="Quantity"
              autoComplete="text"
              size="small"
              onChange={(e) => {
                setquantity(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Price"
              label="Price"
              name="Price"
              type="number"
              color="secondary"
              autoComplete="number"
              size="small"
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => {
                setprice(e.target.value);
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="MRP"
              fullWidthcolor="secondary"
              label="MRP"
              name="MRP"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              autoComplete="number"
              size="small"
              onChange={(e) => {
                setMRP(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              color="secondary"
              required
              fullWidth
              id="tax"
              label="Tax( in % )"
              name="tax"
              autoComplete="text"
              size="small"
              value={tax}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 99 } }}
              onChange={(e) => {
                settax(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="Stock"
              color="secondary"
              label="Stock"
              name="Stock"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 10000 } }}
              autoComplete="number"
              size="small"
              onChange={(e) => {
                setstock(e.target.value);
              }}
            />
            <div className="sub">
              <label htmlFor="subscrip" className="subMAin">
                Subscription
              </label>
              <div class="toggle-switch">
                <input
                  class="toggle-input"
                  id="toggle"
                  type="checkbox"
                  onChange={(e) => {
                    setsubs(subs === 0 ? 1 : 0);
                  }}
                />
                <label class="toggle-label" for="toggle"></label>
              </div>
            </div>

            <div className="auto">
              <Autocomplete
                disablePortal
                sx={{ width: "45%", marginTop: "40px" }}
                id="combo-box-demo"
                color="secondary"
                options={subCateg}
                onChange={(e, data) => setsubCat(data.id)}
                getOptionLabel={(option) => option?.title || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    size="small"
                    fullWidth
                    required
                    color="secondary"
                  />
                )}
              />
            </div>
          </div>
          <div
            className="right"
            style={{
              backgroundColor: colors.cardBG[400],
            }}
          >
            <div className="image">
              <label htmlFor="productImage" className="lbl">
                Product Image
              </label>
              <div className="imgDiv">
                <img
                  src={
                    img
                      ? img
                      : "https://icons-for-free.com/iconfiles/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png"
                  }
                  alt="img"
                />
                <div className="upload">
                  {" "}
                  <Button
                    fullWidth
                    color="secondary"
                    aria-label="upload picture"
                    component="label"
                    variant="contained"
                  >
                    <input
                      hidden
                      accept=".png, .jpg, .jpeg"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files[0].size / 1024 >= 2048) {
                          alert("file size must be less then 2mb");
                        }
                        if (
                          e.target.files &&
                          e.target.files[0] &&
                          e.target.files[0].size / 1024 <= 2048
                        ) {
                          setimg(URL.createObjectURL(e.target.files[0]));
                          setuploadImage(e.target.files[0]);
                          setimgType(1);
                        }
                      }}
                    />
                    Select Image <PhotoCamera />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="desc"
          style={{
            backgroundColor: colors.cardBG[400],
          }}
        >
          <h2>Other Information</h2>

          <TextField
            margin="normal"
            required
            fullWidth
            id="Offer"
            label="Offer"
            name="Offer"
            autoComplete="text"
            color="secondary"
            size="small"
            onChange={(e) => {
              setoffer(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="Description"
            color="secondary"
            label="Description"
            name="Description"
            autoComplete="text"
            size="small"
            multiline
            onChange={(e) => {
              setdesc(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="Disclaimer"
            label="Disclaimer"
            color="secondary"
            name="Disclaimer"
            autoComplete="text"
            size="small"
            minRows="3"
            multiline
            onChange={(e) => {
              setclaimer(e.target.value);
            }}
          />
        </div>

        <div className="delete">
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ fontWeight: "600", letterSpacing: "1px" }}
          >
            {LOADING ? <CircularProgress size={20} /> : "Add New Product"}
          </Button>
        </div>
      </Box>
    </>
  );
}

export default AddProduct;
