/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";

import IngresoCL from "../Componentes/Proveedores/IngresoCL";
import SideBar from "../Componentes/NavBar/SideBar";
import SearchListClientes from "../Componentes/Proveedores/SearchListClientes";

const Clientes = () => {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Button
          variant="outlined"
          color="primary"
          sx={{
            my: 1,
            mx: 2,
          }}
          startDecorator={<Add />}
          onClick={handleOpenModal}
        >
          {uppercaseText}
        </Button> */}

        {/* CLIENTES Button */}
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
          CLIENTES
        </Button>

        <SearchListClientes />

        <Box />



        {/* Modal for IngresoCL */}

        {open && (
          <IngresoCL
            openDialog={open}
            setOpendialog={setOpen}
            onClose={handleCloseModal}
          />
        )}

        {/* <Modal open={openDialog} onClose={onClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              overflow: "auto", // Added scrollable feature
              maxHeight: "100vh", // Adjust as needed
              maxWidth: "180vw", // Adjust as needed
            }}
          >
            <IngresoCL onCLose={onClose} />
          </Box>
        </Modal> */}
      </Box>
    </div>
  );
};

export default Clientes;
