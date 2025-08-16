import React, { useEffect, useState } from "react";
import { Button, Dialog, Box } from "@mui/material";
import SideBar from "../Componentes/NavBar/SideBar.jsx";
import AjusteInventario from "../Componentes/Stock/AjusteInventario.jsx";
import MovimientoStock from "../Componentes/Stock/MovimientoStock.jsx";
import StockModel from "../Models/Stock";
import QrStockMobile from "../Componentes/ScreenDialog/QrStockMobile.jsx";
import NivelesUnidades from "../Componentes/Stock/NivelesUnidades.jsx";
import { Typography } from "@mui/joy";

const Stock = () => {
  // Estado para controlar la apertura/cierre del modal de Ajuste de Inventario
  const [openAjusteInventario, setOpenAjusteInventario] = useState(false);
  const [verMovStock, setVerMovStock] = useState(false);
  const [openNiveles, setOpenNiveles] = useState(false);
  const [showQrStockMobile, setShowQrStockMobile] = useState(false);
  const [qrLink, setQrLink] = useState("");
  const [linkUrl, setLinkUrl] = useState("")

  // Función para abrir el modal
  const handleOpenAjusteInventario = () => {
    setOpenAjusteInventario(true);
  };

  // Función para cerrar el modal
  const handleCloseAjusteInventario = () => {
    setOpenAjusteInventario(false);
  };

  const loadQrLink = () => {
    StockModel.getQrMobileLink((responseData) => {
      console.log("response data", responseData)
      setQrLink(responseData.qr)
    }, () => {
      console.log("no se pudo cargar el qr")
    })
  }

  useEffect(() => {
    loadQrLink()

    setLinkUrl(window.location.href + "mobile")
  }, [])

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100px",
        }}
      >
        <SideBar />
        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={handleOpenAjusteInventario} // Abre el modal al hacer clic en el botón
        >
          Ajuste de inventario
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={() => { setVerMovStock(true) }} // Abre el modal al hacer clic en el botón
        >
          Entrada/Salida
        </Button>

        <Button
          variant="outlined"
          sx={{
            my: 1,
            mx: 2,
          }}
          onClick={() => {
            setOpenNiveles(true)
          }} // Abre el modal al hacer clic en el botón
        >
          Niveles Unidades
        </Button>

        {qrLink != "" && (
          <Button
            variant="outlined"
            sx={{
              my: 1,
              mx: 2,
            }}
            onClick={() => {
              setShowQrStockMobile(true)
            }} // Abre el modal al hacer clic en el botón
          >
            Stock Mobile
          </Button>

        )}

        {linkUrl != "" && (
          <div style={{
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            margin: "10px"
          }}>
            <Typography>Link directo a stock mobile</Typography>
            <Typography><a href={linkUrl}>Hacer click en este boton</a></Typography>
          </div>
        )}
        <QrStockMobile openDialog={showQrStockMobile} setOpenDialog={setShowQrStockMobile} qrLink={qrLink} />


      </Box>

      {/* Dialog para Ajuste de inventario */}
      <Dialog
        open={openAjusteInventario}
        onClose={handleCloseAjusteInventario}
        maxWidth="lg"
        fullWidth
      >
        <AjusteInventario onClose={handleCloseAjusteInventario} />
      </Dialog>

      <Dialog
        open={verMovStock}
        onClose={() => { setVerMovStock(false) }}
        maxWidth="lg"
        fullWidth
      >
        <MovimientoStock onClose={() => { setVerMovStock(false) }} />
      </Dialog>


      {/* Dialog para niveles de unidades de stock */}
      <Dialog
        open={openNiveles}
        onClose={() => {
          setOpenNiveles(false)
        }}
        maxWidth="lg"
        fullWidth
      >
        <NivelesUnidades onClose={() => {
          setOpenNiveles(false)
        }} />
      </Dialog>
    </>
  );
};

export default Stock;