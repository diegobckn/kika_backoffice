// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-refresh/only-export-components */
// /* eslint-disable no-undef */
// /* eslint-disable no-unused-vars */

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   Box,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   IconButton,
//   Pagination,
//   Tabs,
//   Tab,
//   Snackbar,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// //import EditarProducto from "./EditarProducto";
// import ModelConfig from "../../Models/ModelConfig";

// import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
// import Product from "../../Models/Product";

// const SearchListOfferItem = ({
//   product,
//   index,
//   onEditClick,
//   onDeleteClick
// }) => {

//   const apiUrl = ModelConfig.get().urlBase;
  
//   useEffect(()=>{
//     // console.log("mostrando item de producto")
//     // console.log(product)

//   },[])
//   return (
//     <TableRow key={index}>
//       <TableCell>{product.idProducto}</TableCell>
//       <TableCell>
//         {product.nombre}
    
//       </TableCell>
   
//       <TableCell>
//         <span style={{ color: "purple" }}>Precio Costo: </span>
//         {product.precioCosto} <br />
//         <span style={{ color: "purple" }}>Precio Venta: </span>
//         {product.precioVenta} <br />
//       </TableCell>
//       <TableCell>
//       <span style={{ color: "purple" }}>Stock Inicial: </span>
//       {product.stockInicial} <br />
//       <span style={{ color: "purple" }}>Stock Actual: </span>
//       {product.stockActual} <br />
//         <span style={{ color: "purple" }}>Stock Crítico: </span>
//         {product.stockCritico} <br />
//       </TableCell>

//       <TableCell>
//         <IconButton onClick={() => onEditClick(product)}>
//           <EditIcon />
//         </IconButton>
//         <IconButton onClick={() => onDeleteClick(product)}>
//           <DeleteIcon />
//         </IconButton>
//         <Button variant="outlined">
//           Seleccionar
//         </Button>
//       </TableCell>
//     </TableRow>
//   );
// };

// export default SearchListOfferItem;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";

const SearchListOfferItem = ({
  product,
  index,
  onEditClick,
  onDeleteClick,
  onSelectProduct, // Nueva prop para manejar la selección
  setSearchTerm
}) => {

  const apiUrl = ModelConfig.get().urlBase;
  
  useEffect(() => {
    // console.log("mostrando item de producto")
    // console.log(product)
  }, []);

  const handleSeleccionar = () => {
    // Llamar a la función pasada desde el componente padre
    if (onSelectProduct) {
      onSelectProduct(product);
     
    

    }
  };

  return (
    <TableRow key={index}>
      <TableCell>{product.idProducto}</TableCell>
      <TableCell>
        {product.nombre}
      </TableCell>
   
      <TableCell>
     
        <span style={{ color: "purple" }}>Precio Venta: </span>
        {product.precioVenta} <br />
      </TableCell>
      <TableCell>
  
        <span style={{ color: "purple" }}>Stock Actual: </span>
        {product.stockActual} <br />
 
      </TableCell>

      <TableCell>
        {/* <IconButton onClick={() => onEditClick(product)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => onDeleteClick(product)}>
          <DeleteIcon />
        </IconButton> */}
        <Button 
          variant="outlined"
          onClick={handleSeleccionar}
        >
          Seleccionar
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SearchListOfferItem;