/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import ModelConfig from "../../Models/ModelConfig";
import User from "../../Models/User";
import Sale from "../../Models/Sale";
import ModelSales from "../../Models/Sales";
import ProductSold from "../../Models/ProductSold";
import LoadingDialog from "../Dialogs/LoadingDialog";

import {
  Snackbar
} from "@mui/material";
import System from "../../Helpers/System";
import Confirm from "../Dialogs/Confirm";
import PedirSupervision from "../ScreenDialog/PedirSupervision";
import Alert from "../Dialogs/Alert";

export const SelectedOptionsContext = React.createContext();

export const SelectedOptionsProvider = ({ children }) => {
  //init configs values
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [snackMessage, setSnackMessage] = useState(null)

  //set general dialog variables
  const [showLoadingDialog, setShowLoadingDialogx] = useState(false)
  const [loadingDialogText, setLoadingDialogText] = useState("")


  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [textConfirm, setTextConfirm] = useState("")
  const [handleConfirm, setHandleConfirm] = useState(null)
  const [handleNotConfirm, setHandleNotConfirm] = useState(null)
  const [userData, setUserData] = useState(null);
  const [CONFIG, setCONFIG] = useState(null)

  const [verPedirSupervision, setVerPedirSupervision] = useState(false)
  const [accionPedirSupervision, setAccionPedirSupervision] = useState("")
  const [handleConfirmarSupervision, setHandleConfirmarSupervision] = useState(null)
  const [datosConfirmarSupervision, setDatosConfirmarSupervision] = useState({})

  const pedirSupervision = (accion, callbackOk, datos) => {
    setAccionPedirSupervision(accion)
    setDatosConfirmarSupervision(datos)
    setHandleConfirmarSupervision(() => callbackOk)
    setVerPedirSupervision(true)
  }


  const showMessage = (message) => {
    setSnackMessage(message)
    setOpenSnackbar(true)
  }

  const [showAlertDialog, setShowAlert] = useState(false)
  const [titleMsg, setTitleMsg] = useState("")
  const [textMsg, setTextMsg] = useState("")

  const showAlert = (title, text) => {
    if (text) {
      setTitleMsg(title)
      setTextMsg(text)
    } else {
      setTitleMsg("")
      setTextMsg(title)
    }
    setShowAlert(true)
  }

  const init = () => {
    // console.log("init de SelectedOptionsProvider");
    if (!CONFIG)
      setCONFIG(ModelConfig.getInstance().getFirst())
    if (!userData)
      getUserData()
  }

  useEffect(() => {
    init();
  }, []);


  //mostrar un dialog con la animacion del cargando
  const setShowLoadingDialog = (value) => {
    setShowLoadingDialogx(value);
  }

  const setShowLoadingDialogWithTitle = (textToShow = "", value) => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(value);
  }

  const showLoading = (textToShow = "") => {
    setLoadingDialogText(textToShow)
    setShowLoadingDialogx(true);
  }

  //ocultar el dialog en x milisegundos
  const hideLoadingDialog = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }

  const hideLoading = (timeOut = 200) => {
    setTimeout(function () {
      setShowLoadingDialog(false);
    }, timeOut);
  }


  const showConfirm = (text, callbackYes, callbackNo) => {
    setTextConfirm(text)
    setHandleConfirm(() => callbackYes)
    setHandleNotConfirm(() => callbackNo)
    setShowConfirmDialog(true)
  }

  const updateUserData = (data) => {
    setUserData(User.getInstance().saveInSesion(data));
  };

  const getUserData = () => {
    if (User.getInstance().sesion.hasOne())
      setUserData(User.getInstance().getFromSesion());
  };

  const clearSessionData = () => {
    User.getInstance().sesion.truncate();
    setUserData([])
    setUserData([])
  };

  const GeneralElements = () => {
    return (
      <>
        <Snackbar
          open={openSnackbar}
          message={snackMessage}
          autoHideDuration={3000}
          onClose={() => { setOpenSnackbar(false) }}
        />
        <LoadingDialog openDialog={showLoadingDialog} text={loadingDialogText} />
        <Confirm
          openDialog={showConfirmDialog}
          setOpenDialog={setShowConfirmDialog}
          textConfirm={textConfirm}
          handleConfirm={handleConfirm}
          handleNotConfirm={handleNotConfirm}
        />

        <PedirSupervision
          openDialog={verPedirSupervision}
          accion={accionPedirSupervision}
          infoEnviar={datosConfirmarSupervision}
          setOpenDialog={setVerPedirSupervision}
          onConfirm={() => {
            if (handleConfirmarSupervision) handleConfirmarSupervision()
          }}
        />

        <Alert
          openDialog={showAlertDialog}
          setOpenDialog={setShowAlert}
          title={titleMsg}
          message={textMsg}
        />
      </>
    )
  }

  return (
    <SelectedOptionsContext.Provider
      value={{
        init,
        GeneralElements,
        snackMessage,
        showMessage,

        showConfirm,
        showAlert,


        showLoadingDialog,
        setShowLoadingDialog,
        setShowLoadingDialogWithTitle,
        hideLoadingDialog,
        hideLoading,
        loadingDialogText,
        setLoadingDialogText,
        showLoading,

        clearSessionData,
        userData,
        setUserData,
        updateUserData,
        getUserData,

        pedirSupervision

      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export default SelectedOptionsProvider;
