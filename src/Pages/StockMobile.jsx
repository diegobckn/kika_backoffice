/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import SideBar from "../Componentes/NavBar/SideBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Modal from "@mui/joy/Modal";
import { SelectedOptionsContext } from "./../Componentes/Context/SelectedOptionsProvider";
import { Check, HorizontalSplit, LinkedCamera, Search } from "@mui/icons-material";
import Product from "../Models/Product";
import { Grid, InputAdornment, TextField } from "@mui/material";
import EditarProducto from "./../Componentes/Productos/EditarProducto";
import System from "../Helpers/System";
import Model from "../Models/Model";
import CrearSinCodigo from "../Componentes/Productos/SinCodigo/Crear";
import CrearConCodigo from "../Componentes/Productos/ConCodigo/Crear";
import StockMobileQR from "./StockMobileQR";

const StockMobile = () => {

  const {
    showMessage,
    showLoading,
    hideLoading,
    showAlert,
    GeneralElements
  } = useContext(SelectedOptionsContext);


  const [open, setOpen] = useState(false);
  const [openAdd, setopenAdd] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const [open2, setOpen2] = useState(false);

  const [productoEdit, setProductEdit] = useState(null);

  const refInputBuscar = useRef(null)


  useEffect(() => {
    System.intentarFoco(refInputBuscar)
  }, [])

  const checkFoco = () => {
    console.log("checkFoco..")
    // console.log("open", open)
    // console.log("openAdd", openAdd)
    // console.log("openEdit", openEdit)
    if (!open && !open2 && !openAdd && !openEdit) {
      // console.log("intentar foco")
      System.intentarFoco(refInputBuscar)
    }
  }

  useEffect(() => {
    checkFoco()
  }, [open, open2, openAdd, openEdit])



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



  const [searchTerm, setSearchTerm] = useState("");

  const doSearch = (replaceSearch = "") => {
    if (searchTerm == "" && replaceSearch == "") return


    var txtSearch = searchTerm
    if (txtSearch == "") {
      txtSearch = replaceSearch
      setSearchTerm(replaceSearch)
    }

    const sesion = Model.getInstance().sesion
    console.log("sesion", sesion)
    var sesion1 = sesion.cargar(1)
    if (!sesion1) sesion1 = {
      id: 1
    }
    sesion1.ultimaBusquedaStockMobile = searchTerm

    sesion.guardar(sesion1)

    // showLoading("haciendo busqueda por codigo")
    Product.getInstance().findByCodigoBarras({
      codigoProducto: txtSearch
    }, (prods, resp) => {
      const res = resp.data
      // console.log("res", res)
      if (res.cantidadRegistros > 0) {
        // showMessage("existe el producto")
        setProductEdit(res.productos[0])
        setopenEdit(true)

      } else {
        showMessage("no existe el producto")
        setopenAdd(true)
      }

      hideLoading()
    }, () => {
      showMessage("no existe el producto")


      hideLoading()
    })
  }

  const checkEnterSearch = (e) => {
    if (e.keyCode == 13) {
      // console.log("apreto enter")
      doSearch()
    }
  }

  const onCreateFinish = (productoNuevo, mostrarCodigo = false) => {
    if (mostrarCodigo && productoNuevo.codigoProducto) {
      showAlert("El codigo generado es " + productoNuevo.codigoProducto)
    }
    handleCloseStepper()
    handleCloseStepper2()

    setSearchTerm("")
  }

  const [showQrReader, setShowQRReader] = useState(false)
  const [intentSearch, setIntentSearch] = useState(false)

  
  useEffect(() => {
    doSearch()
  }, [intentSearch])
  return (
    <div style={{ display: "flex" }}>
      <GeneralElements />
      <Box sx={{ flexGrow: 1, p: 3 }}>

        <Grid container spacing={2} >
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              sx={{
                marginTop: "20%",
                marginLeft: "10%",
                width: "80%",
              }}
              margin="dense"
              label="Ingresar codigo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                checkEnterSearch(e)
              }}

              ref={refInputBuscar}

              onBlur={() => {
                checkFoco()
              }}


              InputProps={{
                startAdornment: (
                  <InputAdornment position={"start"}>
                    <Search sx={{
                      marginRight: "10px"
                    }} />
                  </InputAdornment>
                ),
              }}

            />

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button sx={{
              marginTop: "10px",
              marginLeft: "10%",
              height: "55px !important",
              width: "80%",
              color: "white",
              backgroundColor: "midnightblue",
              "&:hover": {
                backgroundColor: "#1c1b17 ",
                color: "white",
              },
            }}
              onClick={() => { doSearch() }}
            >Buscar</Button>
          </Grid>

          {/* <Modal open={openAdd} onClose={()=>{ setopenAdd(false)}}> */}
          {/* <Box
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
              height:"40%",
              paddingTop:"10px",
              width:"85%",
              margin:"2.5% auto"
            }}
          > */}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button
              size="large"
              variant="outlined"
              style={{
                marginLeft: "10%",
                padding: "14px",
                marginTop: "80px",
                width: "80%"
              }}
              onClick={handleOpenStepper}
            >
              <Add />
              Producto sin código
            </Button>

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>

            <Button
              size="large"
              variant="outlined"
              style={{
                marginLeft: "10%",
                padding: "14px",
                marginTop: "6px",
                width: "80%"
              }}

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

          </Grid>


          <Grid item xs={12} sm={12} md={12} lg={12}>

            <Button
              size="large"
              variant="outlined"
              style={{
                marginLeft: "10%",
                padding: "14px",
                marginTop: "6px",
                width: "80%",
              }}

              onClick={() => {
                console.log("asd")
                setShowQRReader(true)
              }}
            >

              <LinkedCamera sx={{ 
                left:"-5px",
                top:"-2px",
                position:"relative"
                }} />
              Capturar código
            </Button>

            <StockMobileQR
              openDialog={showQrReader}
              setOpenDialog={setShowQRReader}
              onCapture={(info) => {
                setSearchTerm(info)
                setTimeout(() => {
                  setIntentSearch(!intentSearch)
                }, 500);
              }}
            />

          </Grid>


        </Grid>

        {/* </Box> */}
        {/* </Modal> */}




        <Modal open={open} onClose={() => { }}>
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
            <CrearSinCodigo onSuccessAdd={(pr) => { onCreateFinish(pr, true) }} />

            <Button sx={{
              position: "relative",
              width: "90%",
              // top:"-60px",
              "&:hover": {
                backgroundColor: "red",
                color: "white",
              },
              backgroundColor: "red",
              color: "white",
              margin: "20px 5%"
            }}
              onClick={() => {
                handleCloseStepper()
              }}
            >salir</Button>
          </Box>
        </Modal>

      </Box>
      <Modal open={open2} onClose={() => { }}>
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
          <CrearConCodigo onSuccessAdd={(pr) => { onCreateFinish(pr) }} />

          <Button sx={{
            position: "relative",
            width: "90%",
            // top:"-60px",
            "&:hover": {
              backgroundColor: "red",
              color: "white",
            },
            backgroundColor: "red",
            color: "white",
            margin: "20px 5%"
          }}
            onClick={() => {
              handleCloseStepper2()
            }}
          >salir</Button>

        </Box>


      </Modal>



      {(productoEdit && (
        <EditarProducto
          product={productoEdit}
          open={openEdit}
          handleClose={() => {
            setopenEdit(false)
          }}

          onEdit={() => {
            setSearchTerm("")
          }}
        />
      ))}

    </div>
  );
};

export default StockMobile;
