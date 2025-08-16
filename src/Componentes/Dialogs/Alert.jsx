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

const Alert = ({openDialog, setOpenDialog, message, title = ""}) => {
  return (
    <Dialog
        open={openDialog}
        onClose={ ()=> {
          // setOpenDialog(false)
        } }
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography >{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={ ()=>{ setOpenDialog(false) } }>Aceptar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default Alert;
