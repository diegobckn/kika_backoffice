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
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import DialogSimple from "../Dialogs/DialogSimple";
import FormFamilia from "./FormFamilia";
import Product from "../../Models/Product";

const SearchListFamiliasItem = ({
  item,
  onUpdate = () => { },
  onDelete = () => { },
}) => {

  const {
    showLoading,
    hideLoading,
    showConfirm,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = () => {
    showConfirm("Eliminar " + item.descripcion + "?", () => {
      Product.deleteFamiliy({
        categoriaid: item.idCategoria,
        subcategoriaid: item.idSubcategoria,
        familiaid: item.idFamilia
      }, () => {
        showMessage("Eliminado correctamente")
        onDelete()
      }, showMessage)
    })
  }
  return (
    <TableRow>
      <TableCell>{item.idFamilia}</TableCell>
      <TableCell>{item.descripcion}</TableCell>
      <TableCell>
        <IconButton onClick={() => setShowEdit(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(item.idFamilia)}>
          <DeleteIcon />
        </IconButton>

        <DialogSimple openDialog={showEdit} setOpenDialog={setShowEdit}>
          <FormFamilia onSubmitSuccess={(guardado) => {
            onUpdate(guardado)
            setShowEdit(false)
          }} isEdit={true} editData={item} />
        </DialogSimple>
      </TableCell>
    </TableRow>
  );
};

export default SearchListFamiliasItem;
