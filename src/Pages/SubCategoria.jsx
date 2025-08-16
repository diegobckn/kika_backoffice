
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import SideBar from '../Componentes/NavBar/SideBar'
import Add from "@mui/icons-material/Add";
import SearchListSubCategories from '../Componentes/Productos/SearchListSubCategories';
import DialogSimple from '../Componentes/Dialogs/DialogSimple';
import FormSubCategoria from '../Componentes/Productos/FormSubCategoria';

const SubCategorias = () => {

  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const [catId, setCatId] = useState(-1);

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
          Sub-Categoría
        </Button>
        <SearchListSubCategories
          refresh={refreshList}
          onChageCategory={(catIdx) => {
            setCatId(catIdx)
          }} />

        <DialogSimple openDialog={open} setOpenDialog={setOpen}>
          <FormSubCategoria
            idCategoria={catId}
            onSubmitSuccess={() => {
              setRefreshList(!refreshList)
              setOpen(false)
            }} />
        </DialogSimple>

      </Box>
    </div>
  )
}

export default SubCategorias