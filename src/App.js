import React, { useEffect } from "react";
import Login from "./Pages/Login";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateCategory } from "./Redux/Store/CategorySlice";
import { GET } from "./Functions/apiFunction";
import api from "./Data/api";
import { updateProducts } from "./Redux/Store/productSlice";
import { updatesubCategory } from "./Redux/Store/subcatSlice";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./Global/Topbar";
import Sidebar from "./Global/Sidebar";
import Dashboard from "./Global/Dashboard";
import { updateUsers } from "./Redux/Store/userSlice";

function App() {
  const [theme, colorMode] = useMode();
  const dispatch = useDispatch();
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  const token = `Bearer ${admin?.token}`;

  useEffect(() => {
    const getCat = async () => {
      const url = `${api}/get_cat`;
      const cat = await GET(token, url);
      dispatch(updateCategory(cat.data));
    };
    admin && getCat();
  }, [token, dispatch, admin]);

  useEffect(() => {
    // get subcat
    const getsubcat = async () => {
      const url = `${api}/get_sub_cat`;
      const subcat = await GET(token, url);
      dispatch(updatesubCategory(subcat.data));
    };
    admin && getsubcat();
  }, [token, dispatch, admin]);

  useEffect(() => {
    const getCat = async () => {
      const url = `${api}/get_product`;
      const products = await GET(token, url);
      dispatch(updateProducts(products.data));
    };
    getCat();
  }, [token, dispatch, admin]);
  useEffect(() => {
    const users = async () => {
      const url = `${api}/get_user`;
      const users = await GET(token, url);
      dispatch(updateUsers(users.data));
    };
    users();
  }, [token, dispatch, admin]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{}}>
          {admin ? (
            <>
              {" "}
              <Sidebar />
              <main className="content">
                <Topbar />
                <Dashboard />
              </main>
            </>
          ) : (
            <Login />
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
