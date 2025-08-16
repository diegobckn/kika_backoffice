import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";
import User from "../../Models/User";
import BoxOptionList from "../Elements/BoxOptionList";
import MainButton from "../Elements/MainButton";
import { maxWidth, width } from "@mui/system";
import InputPassword from "../Elements/Compuestos/InputPassword";
import Model from "../../Models/Model";
import System from "../../Helpers/System";
import dayjs from "dayjs";

const GenerarAutorizacion = ({
  selectedUser,
  openDialog,
  setOpenDialog,
  onCreate
}) => {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    userData, 
    showMessage
  } = useContext(SelectedOptionsContext);

  const [caducidad, setCaducidad] = useState(2)
  
  const opcionesCaducidad = [
    {
      id: 1,
      value:"dia"
    },
    {
      id: 2,
      value:"semana"
    },
    {
      id: 3,
      value:"mes"
    }
  ]

  const getCaducidad = ()=>{
    var val = ""
    opcionesCaducidad.forEach((cad,ix)=>{
      if(cad.id == caducidad){
        val = cad.value
      }
    })
    return val
  }

  const [verGenerado, setVerGenerado] = useState(false)
  const [qr, setQr] = useState("")
  const [hash, setHash] = useState("")
  
  const clave = useState("")
  const claveValidacion = useState("")


  const verDiv = (dat)=>{
    const allDiv = document.querySelectorAll(".divAutorizacion")
    if(allDiv.length>0){
      document.querySelectorAll(".divAutorizacion").forEach((div)=>{
        if(div){
          div.innerHTML = dat
        }
      })
    }else{
      setTimeout(() => {
        verDiv(dat)
      }, 500);
    }
  }

  const enviarAutorizador = ()=>{
    showLoading("Generando autorizacion...")
    Model.addSupervision({
      fechaIngreso: System.getInstance().getDateForServer(dayjs()),
      codigoUsuario : selectedUser.codigoUsuario,
      opcionCaducidad: getCaducidad(),
      clave:clave[0],
      codigoUsuarioAutorizador: User.getInstance().getFromSesion().codigoUsuario
    },(res)=>{
      hideLoading()
      setVerGenerado(true)
      verDiv(res.autorizacion)
      onCreate()
      // document.querySelectorAll(".divAutorizacion").forEach((div)=>{
        //   console.log("div", div)
        //   if(div){
          //     div.innerHTML = res.autorizacion
          //   }
          // })
        },(err)=>{
      hideLoading()
      showMessage(err)
    })
  }

  useEffect(()=>{
    setVerGenerado(false)
  },[openDialog])

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle>Generar Autorizacion</DialogTitle>
      <DialogContent>

      <Grid container spacing={2} sx={{ mt: 2}}>

          {!verGenerado ? (
          <>
          <Grid item xs={12} sm={12} md={12} lg={12}>

          <BoxOptionList
            optionSelected={caducidad}
            setOptionSelected={setCaducidad}
            options={opcionesCaducidad}
          />

          </Grid>
          

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <InputPassword
              inputState={clave}
              fieldName="clave"
              required={false}
              withLabel={false}
              validationState={claveValidacion}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <MainButton actionButton={()=>{
              enviarAutorizador()
            }} textButton={"Generar autorizacion"} style={{
              width:"300px"
            }}/>
          </Grid>
          </>
        ) : (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Generado</Typography>
            {/* <input type="text" value={hash} /> */}

            {/* <Typography>Autozacion</Typography> */}
            {/* <Image src={qr}  /> */}
            <div className="divAutorizacion"></div>
          </Grid>
        )}
      
      
      </Grid>


      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        
      </DialogActions>
    </Dialog>
  );
};

export default GenerarAutorizacion;
