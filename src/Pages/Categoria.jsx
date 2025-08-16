/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import SideBar from '../Componentes/NavBar/SideBar'
import Add from "@mui/icons-material/Add";
import IngresoCategorias from '../Componentes/Productos/FormCategoria';

import SearchListCategories from '../Componentes/Productos/SearchListCategories';
import DialogSimple from '../Componentes/Dialogs/DialogSimple';


const Categorias = () => {

  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  return (
    <div style={{ display: "flex" }}>

      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startIcon={<Add />}
          onClick={() => { setOpen(true) }}
        >
          Categoría
        </Button>
        <SearchListCategories refresh={refreshList} />

        <DialogSimple openDialog={open} setOpenDialog={setOpen}>
          <IngresoCategorias onSubmitSuccess={() => { 
            setRefreshList(!refreshList)
            setOpen(false)
            }} />
        </DialogSimple>
      </Box>
    </div>
  )
}

export default Categorias