/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import SideBar from '../Componentes/NavBar/SideBar'
import Add from "@mui/icons-material/Add";
import IngresoFamilia from '../Componentes/Productos/IngresoFamilia';

import SearchListFamilias from '../Componentes/Productos/SearchListFamilias';
import FormFamilia from '../Componentes/Productos/FormFamilia';
import DialogSimple from '../Componentes/Dialogs/DialogSimple';

const Familias = () => {

  const [open, setOpen] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const [catId, setCatId] = useState(-1);
  const [subcatId, setSubCatId] = useState(-1);

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
          onClick={() => {
            setOpen(true)
          }}
        >
          Familia
        </Button>
        <SearchListFamilias
          refresh={refreshList}
          onChageCategory={(catIdx) => {
            setCatId(catIdx)
          }}

          onChageSubCategory={(subid) => {
            setSubCatId(subid)
          }}
          />


        <DialogSimple openDialog={open} setOpenDialog={setOpen}>
          <FormFamilia
            idCategoria={catId}
            idSubcategoria={subcatId}
            onSubmitSuccess={() => {
              setRefreshList(!refreshList)
              setOpen(false)
            }}
          />
        </DialogSimple>












      </Box>
    </div>
  )
}

export default Familias

