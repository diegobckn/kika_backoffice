import React, { useState, useEffect, useContext } from "react";
import {
  TableCell,
  TableRow,
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

import System from "../../Helpers/System";

const CostoGananciaItem = ({
  info,
  index,
  currentPage
}) => {

  return (
    <TableRow key={index}>
      <TableCell>{info.codBarra}</TableCell>
      <TableCell>
        {info.descripcion}
      </TableCell>
      <TableCell>
        {System.formatMonedaLocal(info.precioCosto, false)} <br />
      </TableCell>
      <TableCell>
        {System.formatMonedaLocal(info.precioVenta, false)} <br />
      </TableCell>
      <TableCell>
      {System.formatMonedaLocal(info.margen, false)} <br />
      </TableCell>
      <TableCell sx={{ textAlign: "center" }} >
        #{((currentPage - 1) * 10) + index + 1}
      </TableCell>
    </TableRow>
  );
};

export default CostoGananciaItem;
