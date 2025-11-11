/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import SearchListProducts from "../Componentes/Productos/SearchListProduct";
import { HorizontalSplit } from "@mui/icons-material";
import CrearProductosSinCodigo from "../Componentes/Productos/SinCodigo/Crear";
import CrearProductosConCodigo from "../Componentes/Productos/ConCodigo/Crear";

const Productos = () => {

  const [refresh, setRefresh] = useState(false);


  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);

  const handleOpenStepper = () => {
    setOpen(true);
  };
  const handleCloseStepper = () => {
    setOpen(false);
  };

  const handleOpenStepper2 = () => {
    setOpen2(true);
  };
  const handleCloseStepper2 = () => {
    setOpen2(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
          onClick={handleOpenStepper}
        >
          <Add />
          Producto sin código
        </Button>
        <Button
          size="large"
          variant="outlined"
          style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}

          onClick={handleOpenStepper2}
        >
          <HorizontalSplit sx={{ transform: "rotate(270deg)" }} />
          <Add sx={{
            width: "15px",
            position: "relative",
            left: "-7px"
          }} />
          Producto con código
        </Button>

        <SearchListProducts
          refresh={refresh}
          setRefresh={setRefresh}
        />

        <Modal open={open} onClose={handleCloseStepper}>
          <Box
            sx={{
              // position: "absolute",
              // top: "50%",
              // left: "50%",
              // transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              // p: 4,
              overflow: "auto", // Added scrollable feature
              // maxHeight: "100vh", // Adjust as needed
              // maxWidth: "180vw", // Adjust as needed
              height: "90%",
              paddingTop: "10px",
              width: "75%",
              margin: "2.5% auto"
            }}
          >
            {/* <StepperSI onSuccessAdd={()=>{ setRefresh(!refresh) }}/>  */}
            <CrearProductosSinCodigo onSuccessAdd={() => { setRefresh(!refresh) }} />
          </Box>
        </Modal>

      </Box>
      <Modal open={open2} onClose={handleCloseStepper2}>
        <Box
          sx={{
            // position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            // p: 4,
            overflow: "auto", // Added scrollable feature
            // maxHeight: "100vh", // Adjust as needed
            // maxWidth: "180vw", // Adjust as needed
            height: "90%",
            paddingTop: "10px",
            width: "85%",
            margin: "2.5% auto"
          }}
        >
          {/* <StepperSI conCodigo={true} onSuccessAdd={()=>{ setRefresh(!refresh) }} /> */}
          <CrearProductosConCodigo onSuccessAdd={() => { setRefresh(!refresh) }} />
        </Box>
      </Modal>
    </div>
  );
};

export default Productos;
