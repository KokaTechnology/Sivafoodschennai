import React, { useContext } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { ColorModeContext } from "./../theme";
import {
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

function Topbar() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <Box display="flex" justifyContent="flex-end" p={1} width="100%">
      <Box display="flex" gap="20px">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>
        <IconButton>
          <PersonOutlineOutlined />
        </IconButton>
        <IconButton
          onClick={() => {
            sessionStorage.removeItem("admin");
            window.location.reload("/");
          }}
        >
          <LogoutOutlined />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Topbar;
