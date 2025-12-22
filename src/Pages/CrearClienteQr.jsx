/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";

import IngresoCL from "../Componentes/Proveedores/IngresoCL";
import SideBar from "../Componentes/NavBar/SideBar";
import SearchListClientes from "../Componentes/Proveedores/SearchListClientes";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";


export default ({

}) => {

  const {
    GeneralElements,
    showAlert

  } = useContext(SelectedOptionsContext);
  const [open, setOpen] = useState(true);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <div style={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          DARME DE ALTA
        </Button>

        <Box />

        <GeneralElements />

        {open && (
          <IngresoCL
          titulo="Darme de alta como cliente"
            openDialog={open}
            setOpendialog={setOpen}
            onClose={handleCloseModal}
            onExist={() => {
              showAlert("Ya existe el rut, seguramente ya se dio de alta")
            }}
          />
        )}

      </Box>
    </div>
  );
};

