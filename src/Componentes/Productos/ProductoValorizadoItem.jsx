import React, { useState, useEffect, useContext } from "react";
import {
  TableCell,
  TableRow,
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

import System from "../../Helpers/System";

const ProductoValorizadoItem = ({
  product,
  index,
  tipoPrecio
}) => {

  return (
    <TableRow key={index}>
      <TableCell>{product.idProducto}</TableCell>
      <TableCell>
        {product.nombre}
      </TableCell>
      {/* <TableCell> */}
      {/* {System.formatMonedaLocal(product.precioCosto, false)} <br /> */}
      {/* </TableCell> */}
      <TableCell>
        {tipoPrecio === 0 ? (
          System.formatMonedaLocal(product.precioCosto, false)
        ) : (
          System.formatMonedaLocal(product.precioVenta, false)
        )}
        < br />
      </TableCell>
      <TableCell>
        {product.stockActual} <br />
      </TableCell>
      <TableCell>
        {tipoPrecio === 0 ? (
          System.formatMonedaLocal(product.precioCosto * product.stockActual, false)
        ) :
          System.formatMonedaLocal(product.precioVenta * product.stockActual, false)
        }
      </TableCell>
    </TableRow>
  );
};

export default ProductoValorizadoItem;
