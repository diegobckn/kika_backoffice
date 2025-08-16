/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import { SelectedOptionsContext } from "../Componentes/Context/SelectedOptionsProvider";

import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@mui/material";
import System from "../Helpers/System";
import SmallButton from "../Componentes/Elements/SmallButton";
import { ChangeCircleTwoTone } from "@mui/icons-material";

const StockMobileQR = ({
  openDialog,
  setOpenDialog,
  onCapture
}) => {
  const {
    showMessage,
    showLoading,
    hideLoading,
    showAlert,
    GeneralElements
  } = useContext(SelectedOptionsContext);

  const [camIds, setCamIds] = useState([])
  const [camIdSelected, setCamIdSelected] = useState(null)
  const [currentId, setCurrentId] = useState(0)

  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }

  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }


  const getCams = () => {
    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length > 0) {
        var cameraId = devices[0].id;
        // .. use this to start scanning.
        var ids = []

        devices.forEach((dev) => {
          ids.push(dev.id)
        })
        if (ids.length > 0) {
          setCamIdSelected(ids[0])
          // showMessage("hay " + (ids.length) + " camaras..asigna camara a:" + ids[0])
          if (ids.length >= 2) {
            setCamIdSelected(ids[1])//la segunda camara es mejor
          }
        }
        setCamIds(ids)
      }
    }).catch(err => {
      // handle err
      showAlert("no se pudo obtener las camaras")
    });
  }


  const salir = () => {
    setOpenDialog(false)

    try {
      if (controllerCam.isScanning) {
        controllerCam.stop()
      }
    } catch (er) {
      console.log("catch de stop..", er)
      // setTimeout(() => {
      //   showMessage(er)
      // }, 1000);
    }


  }




  const doScan = () => {
    // showMessage("doScan")
    // try {
    //   controllerCam.stop()
    // } catch (e) {
    // }
    try {

      controllerCam.start(
        camIdSelected,
        {
          fps: 10,    // Optional, frame per seconds for qr code scanning
          qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
        },
        (decodedText, decodedResult) => {
          // do something when code is read
          // showAlert(decodedText)
          onCapture(decodedText)
          salir()
        },
        (errorMessage) => {
          // parse error, ignore it.
          // showAlert("callbackfail:" + errorMessage)
        })
        .catch((err) => {
          // Start failed, handle it.
          showAlert("catch:" + err)
        });
    } catch (ers) {
      setTimeout(() => {
        showMessage("catch de start:" + ers)
      }, 1000);
    }
  }
  const [controllerCam, setControllerCam] = useState(null)
  const [intentDiv, setIntentDiv] = useState(0)

  useEffect(() => {
    console.log("cambio opendialog", openDialog)
    if (!openDialog) return


    // console.log("intentDiv",intentDiv)
    // console.log("controllerCam",controllerCam)
    // console.log("camIds",camIds)
    // console.log("camIdSelected",camIdSelected)
    setIntentDiv(intentDiv + 1)
  }, [openDialog])

  useEffect(() => {
    if (!openDialog) return
    // console.log('document.querySelector("#reader")', document.querySelector("#reader"))
    if (document.querySelector("#reader")) {
      if(controllerCam){
        doScan()
        return
      }
      setControllerCam(new Html5Qrcode("reader", {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
        ]
      }))
    } else {
      console.log("no existe reader")
      setTimeout(() => {
        setIntentDiv(intentDiv + 1)
      }, 500);
    }
  }, [intentDiv])

  useEffect(() => {
    console.log("controllerCam", controllerCam)
    if (controllerCam) {
      getCams()
    }
  }, [controllerCam])


  useEffect(() => {
    if (camIdSelected) {
      doScan()
    }
    // setTimeout(() => {
      // showMessage("cambio camIdSelected:" + camIdSelected)
    // }, 500);
  }, [camIdSelected])

  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      maxWidth={"lg"}
      fullWidth
    >
      <DialogTitle>Capturar codigo</DialogTitle>
      <DialogContent>
        <div>
          <SmallButton style={{ width: "100%", left: "-5px" }} actionButton={() => {
            var proxid = currentId + 1
            if (proxid >= camIds.length) proxid = 0
            setCurrentId(proxid)
            // console.log("proxid", proxid)
            // showMessage("cambiando camara " + (proxid + 1) + "/" + (camIds.length) + " a:" + camIds[proxid])
            setCamIdSelected(camIds[proxid])
            // console.log("controllerCam.isScanning", System.clone(controllerCam.isScanning))
            try {
              if (controllerCam.isScanning) {
                controllerCam.stop()
              }
            } catch (er) {
              console.log("catch de stop..", er)
              // setTimeout(() => {
              //   showMessage(er)
              // }, 1000);
            }
          }}
            textButton={(<Typography>
              <ChangeCircleTwoTone />
              Cambiar camara
            </Typography>
            )}
          />

          <div id="reader" width="600px"></div>
        </div>


      </DialogContent>
      <DialogActions>
        <Button onClick={salir} color="primary">
          Cancelar
        </Button>
        {/* <Button onClick={handleLogout} color="primary">
          Confirmar
        </Button> */}
      </DialogActions>
    </Dialog>




  );
};

export default StockMobileQR;
