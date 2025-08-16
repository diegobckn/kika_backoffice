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

const Confirm = ({
    openDialog,
    setOpenDialog,
    textConfirm,
    handleConfirm,
    handleNotConfirm
  }) => {

  return (
    <Dialog open={openDialog} onClose={()=>{
    }}
    >
      <DialogTitle style={{
        fontSize:"28px"
      }}>Confirmar</DialogTitle>
      <DialogContent style={{
        minWidth:"300px",
        padding:20
      }}>
      <Typography style={{
        textAlign:"center",
        fontSize:"22px"
      }}>{textConfirm}</Typography>
      </DialogContent>
      <DialogActions>

      <Button onClick={()=>{
        if(handleConfirm){
          handleConfirm()
        }
        setOpenDialog(false)
        }}
        style={{
          fontSize:"20px",
          backgroundColor:"green",
          color:"white"
        }}
        >Si</Button>

        <Button onClick={()=>{
          if(handleNotConfirm){
            handleNotConfirm()
          }
          setOpenDialog(false)
        }}
        style={{
          fontSize:"20px",
          backgroundColor:"#c02e2e",
          color:"white"
        }}>No</Button>
      </DialogActions>
      </Dialog>
  );
};

export default Confirm;
