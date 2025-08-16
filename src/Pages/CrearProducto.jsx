/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";
import { HorizontalSplit } from "@mui/icons-material";
import { Dialog, DialogContent, TextField } from "@mui/material";
import CrearProductosSinCodigo from "../Componentes/Productos/SinCodigo/Crear";
import CrearProductosConCodigo from "../Componentes/Productos/ConCodigo/Crear";

const CrearProducto = ({
  openAdd,
  setopenAdd,
  onSuccessAdd
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);



  const [openAddWithCode, setOpenAddWithCode] = useState(false);
  const [openAddNoCode, setOpenAddNoCode] = useState(false);





  return (
    <div style={{
      display: "flex",

    }}>

      <Dialog open={openAdd} maxWidth="md" fullWidth onClose={() => {
        setopenAdd(false)
      }}
      >
        <DialogContent>

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
              height: "40%",
              minHeight: "400px",
              paddingTop: "10px",
              width: "85%",
              margin: "2.5% auto"
            }}
          >
            <Button
              size="large"
              variant="outlined"
              style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}
              onClick={() => {
                setOpenAddNoCode(true)
              }}
            >
              <Add />
              Producto sin código
            </Button>
            <Button
              size="large"
              variant="outlined"
              style={{ marginLeft: "18px", padding: "14px", marginTop: "6px" }}

              onClick={() => {
                setOpenAddWithCode(true)

              }}
            >
              <HorizontalSplit sx={{ transform: "rotate(270deg)" }} />
              <Add sx={{
                width: "15px",
                position: "relative",
                left: "-7px"
              }} />
              Producto con código
            </Button>


          </Box>

        </DialogContent>
      </Dialog>

      <Dialog open={openAddNoCode} maxWidth="lg" onClose={() => {
        setOpenAddNoCode(false)
      }}
      >
        <DialogContent>
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
              height: "80%",
              paddingTop: "10px",
              width: "85%",
              margin: "2.5% auto"
            }}
          >
            <CrearProductosSinCodigo
              onSuccessAdd={onSuccessAdd}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openAddWithCode} maxWidth="lg" onClose={() => {
        setOpenAddWithCode(false)
      }}
      >
        <DialogContent>
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
           
            <CrearProductosConCodigo
              onSuccessAdd={onSuccessAdd}
            />

          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrearProducto;
