/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navegacion from "../NavBar/Navegacion";
import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Box from "@mui/material/Box";
import Add from "@mui/icons-material/Add";
import PreciosGenerales from "./PreciosGenerales";

const CardModal = () => {
  const [open, setOpen] = useState(false);
  const text = "Precios Generales";
  const uppercaseText = text.toUpperCase();

  return (
    <>
     
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        {uppercaseText}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
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
            maxHeight: "80vh", // Adjust as needed
            maxWidth: "200vw", // Adjust as needed
          }}
        >
          <PreciosGenerales />
        </Box>
      </Modal>
    </>
  );
};

export default CardModal;
