/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { Modal } from "@mui/material";
import SideBar from '../Componentes/NavBar/SideBar'
import Add from "@mui/icons-material/Add";
import IngresoSubFamilias from '../Componentes/Productos/IngresoSubFamilia';
import SearchListSubFamilias from '../Componentes/Productos/SearchListSubFamilias';
import FormSubFamilia from '../Componentes/Productos/FormSubFamilia';
import DialogSimple from '../Componentes/Dialogs/DialogSimple';

const SubFamilias = () => {
  const [open, setOpen] = useState(false);

  const [refreshList, setRefreshList] = useState(false);

  const [catId, setCatId] = useState(-1);
  const [subcatId, setSubCatId] = useState(-1);
  const [famId, setFamId] = useState(-1);

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
          Sub-Familia
        </Button>
        <SearchListSubFamilias
          refresh={refreshList}

          onChageCategory={(catIdx) => {
            setCatId(catIdx)
          }}
          
          onChageSubCategory={(catIdx) => {
            setSubCatId(catIdx)
          }}

          onChageFamily={(famIdx) => {
            setFamId(famIdx)
          }}
          
          />


        <DialogSimple openDialog={open} setOpenDialog={setOpen}>
          <FormSubFamilia
            idCategoria={catId}
            idSubcategoria={subcatId}
            idFamilia={famId}
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

export default SubFamilias