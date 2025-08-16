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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import FormCategoria from "./FormCategoria";
import DialogSimple from "../Dialogs/DialogSimple";
import FormSubCategoria from "./FormSubCategoria";


const SearchListSubCategoriesItem = ({
  item,
  onUpdate = () => { },
  onDelete = () => { },
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = () => {
    showConfirm("Eliminar " + item.descripcion + "?", () => {
      Product.deleteSubCategory({
        categoriaid: item.idCategoria,
        subcategoriaid: item.idSubcategoria
      }, () => {
        showMessage("Eliminado correctamente")
        onDelete()
      }, showMessage)
    })
  }

  return (
    <TableRow>
      <TableCell>{item.idSubcategoria}</TableCell>
      <TableCell>{item.descripcion.trim()}</TableCell>
      <TableCell>
        <IconButton onClick={() => setShowEdit(true)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>

        <DialogSimple openDialog={showEdit} setOpenDialog={setShowEdit}>
          <FormSubCategoria onSubmitSuccess={(guardado) => {
            onUpdate(guardado)
            setShowEdit(false)
          }} isEdit={true} editData={item} />
        </DialogSimple>

      </TableCell>
    </TableRow>
  );
};

export default SearchListSubCategoriesItem;
