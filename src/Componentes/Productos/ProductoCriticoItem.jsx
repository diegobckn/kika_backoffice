import React, { useState, useEffect, useContext } from "react";
import {
  TableCell,
  TableRow,
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

import System from "../../Helpers/System";

const ProductoCriticoItem = ({
  product,
  index,
  currentPage
}) => {

  return (
    <TableRow key={index}>
      <TableCell>{product.idProducto}</TableCell>
      <TableCell>
        {product.nombre}
      </TableCell>
      <TableCell>
        {System.formatMonedaLocal(product.precioCosto, false)} <br />
      </TableCell>
      <TableCell>
        {System.formatMonedaLocal(product.precioVenta, false)} <br />
      </TableCell>
      <TableCell>
        {product.stockActual} <br />
      </TableCell>
      <TableCell>
        {product.stockCritico}
      </TableCell>
      <TableCell>{product.marca}</TableCell>
      <TableCell sx={{ textAlign: "center" }} >
        #{((currentPage - 1) * 10) + index + 1}
      </TableCell>
    </TableRow>
  );
};

export default ProductoCriticoItem;
