import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  ListItem,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputLabel,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogContent,
  Typography,
  DialogActions,
  Tooltip,
} from "@mui/material";
import SideBar from "../../../Componentes/NavBar/SideBar";
import Add from "@mui/icons-material/Add";
import SearchListDocumento from "./SearchlistDocumento/SearchListDocumento";
import IngresoDocCompra from "./FormularioCompra";

const Index = () => {
  const [showIngresoDocCompra, setShowIngresoDocCompra] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ my: 1, mx: 2 }}
          startIcon={<Add />}
          onClick={()=>setShowIngresoDocCompra(true)}
        >
          Ingresa Documento de Compra
        </Button>

        <SearchListDocumento />

        {showIngresoDocCompra && (
          <IngresoDocCompra
            openDialog={showIngresoDocCompra}
            setOpenDialog={setShowIngresoDocCompra}
            onClose={()=>{}}
            onFinish={()=>{}} />
        )}
        


        
       
      </Box>
    </div>
  );
};

export default Index;
