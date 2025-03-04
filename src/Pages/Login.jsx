import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { LinearProgress, Link, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import api from "../Data/api";
import axios from "axios";
import loginBG from "../assets/IMGBG.jpg";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const [isLoading, setisLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [type, settype] = React.useState("");
  const [msg, setmsg] = React.useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    setisLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const login = await axios.post(`${api}/login`, loginData);
      const { data } = login;
      setisLoading(false);
      setOpen(true);
      if (data.response === 200) {
        setmsg("login Success");
        settype("success");
        const admin = {
          token: data.token,
          name: data.data.name,
          email: data.data.email,
          fcm: data.data.fcm,
          phone: data.data.phone,
          role: data.data.role,
        };
        console.log(admin);
        sessionStorage.setItem("admin", JSON.stringify(admin));

        window.location.reload("/");
      } else {
        setmsg("Invalid Email Or Password");
        settype("error");
      }
    } catch (error) {
      setisLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
      <Box
        component="main"
        maxWidth="xs"
        sx={{ display: "flex", width: "100vw", height: "100vh" }}
      >
        <Box
          width={"50%"}
          sx={{
            backgroundImage: `url(${loginBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            width: "50%",
            padding: "0 30px",
          }}
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            width={"60%"}
            alignItems={"center"}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Admin Login
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "60%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              color="secondary"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              color="secondary"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Link
            href="https://basketdemo.techashna.com/forget-password"
            target="_blank"
            rel="noopener"
          >
            Forget Password?
          </Link>
          <Box mt={5}>
            <Typography component="h6" variant="h5">
              Demo Email- <b>admin@gmail.com</b>
            </Typography>
            <Typography component="h6" variant="h5">
              Demo password- <b>12345678</b>
            </Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
