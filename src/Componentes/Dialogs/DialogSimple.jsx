import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const DialogSimple = ({
  title = '',
  children,
  closeOnClick = true,
  openDialog,
  setOpenDialog
}) => {

  return (
    <Dialog maxWidth={"lg"} open={openDialog} onClose={() => {
      if (closeOnClick) {
        setOpenDialog(false)
      }
    }}
    >
      <DialogTitle style={{
        fontSize: "28px"
      }}>{title}</DialogTitle>
      <DialogContent>

        {children}

      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSimple;
