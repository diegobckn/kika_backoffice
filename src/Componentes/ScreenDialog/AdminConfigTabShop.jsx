/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  TextField,
  Typography
} from "@mui/material";

import ModelConfig from "../../Models/ModelConfig";
import TabPanel from "../Elements/TabPanel";
import SmallButton from "../Elements/SmallButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxOptionList from "../Elements/BoxOptionList";
import CriterioCosto from "../../definitions/CriterioCosto";
import StorageSesion from "../../Helpers/StorageSesion";
import Shop from "../../Models/Shop";
import InputFile from "../Elements/Compuestos/InputFile";
import System from "../../Helpers/System";
import { width } from "@mui/system";
import InputName from "../Elements/Compuestos/InputName";
import InputPage from "../Elements/Compuestos/InputPage";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import ShopDeliveryZones from "./ShopDeliveryZones";
import ShopDeliveryTimes from "./ShopDeliveryTimes";


const AdminConfigTabShop = ({
  tabNumber,
  setSomeChange,
  closeModal = () => { }
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const TAB_INDEX = 4


  const [infoComercio, setInfoComercio] = useState(null)
  const [image, setImage] = useState("")
  const [val_image, setVal_image] = useState(null)
  const [hasConnectionMp, setHasConnectionMp] = useState(null)
  const [linkToConnectMp, setLinkToConnectMp] = useState("")
  const [checkingConnectMp, setCheckingConnectMp] = useState(false)

  const [cambioAlgo, setCambioAlgo] = useState(false)
  const [showZones, setShowZones] = useState(false)
  const [showTimes, setShowTimes] = useState(false)

  const inputs = {
    name: useState(""),
    full_adress: useState(""),
    description: useState(""),
    unique_doc: useState(""),
    gps_position: useState(""),
    time_start: useState(""),
    time_end: useState(""),
    url: useState("")
  }

  const validations = {
    name: useState(""),
    full_adress: useState(""),
    description: useState(""),
    unique_doc: useState(""),
    gps_position: useState(""),
    time_start: useState(""),
    time_end: useState(""),
    url: useState("")
  }

  const achicarInfo = (infoCompleta) => {
    const infoMin = {}
    infoCompleta.forEach((con, ix) => {
      if (con.grupo == "ImpresionTicket") {
        infoMin[con.entrada] = con.valor
      }
    })
    return infoMin
  }

  const showMessageLoading = (err) => {
    showMessage(err)
    hideLoading()
  }


  const getInfoComercio = (callbackOk) => {
    var comSes = new StorageSesion("comercio")
    if (!comSes.hasOne()) {
      showLoading("Cargando info del comercio...")
      ModelConfig.getAllComercio((info) => {
        const infoMin = achicarInfo(info.configuracion)
        hideLoading()
        comSes.guardar(infoMin)
        callbackOk(infoMin)
      }, showMessageLoading)
    } else {
      callbackOk(comSes.cargar(1))
    }
  }

  const setInputValues = (values) => {
    // console.log("setInputValues", values)
    const names = Object.keys(values)
    const namesInputs = Object.keys(inputs)
    names.forEach((name) => {
      // console.log("name", name)
      if (namesInputs.indexOf(name) > -1) {
        // console.log("es correcto, asigno..", values[name])
        inputs[name][1](values[name])
      }
    })
  }

  const getInputValues = () => {
    // console.log("getInputValues", infoComercio)
    const names = Object.keys(infoComercio)
    const namesInputs = Object.keys(inputs)

    var result = []

    names.forEach((name) => {
      // console.log("name", name)
      if (namesInputs.indexOf(name) > -1) {
        // console.log("es correcto, asigno..", inputs[name][0])
        result[name] = inputs[name][0]
        // inputs[name][1](values[name])
      }
    })
    // console.log("devuelve", result)
    return result
  }

  const someChangeInput = () => {
    // console.log("getInputValues", infoComercio)
    if (!infoComercio) return false
    const names = Object.keys(infoComercio)
    const namesInputs = Object.keys(inputs)

    var hasChange = false

    names.forEach((name) => {
      // console.log("name", name)
      if (namesInputs.indexOf(name) > -1) {
        if (infoComercio[name] != inputs[name][0]) {
          hasChange = true
        }
      }
    })
    // console.log("devuelve", result)
    return hasChange
  }

  const onLoad = () => {
    getInfoComercio((infoCom) => {
      // console.log("info de comercio", infoCom)
      infoCom.url_base = ModelConfig.get("urlBase")
      showLoading("Buscando informacion del servidor...")
      Shop.prepare(infoCom, (response) => {
        hideLoading()
        // console.log("respuesta de softus", response)
        setInfoComercio(response.info)
        setInputValues(response.info)
        setTimeout(() => {
          setCambioAlgo(false)
        }, 1000);
      }, showMessageLoading)
    })
  }

  const actualizarInfoComercio = () => {
    console.log("Actualizando informacion del comercio")

    const totalInfo = Object.assign(infoComercio, getInputValues())
    // console.log("totalInfo", totalInfo)
    showLoading("Actualizando informacion del comercio")
    Shop.actualizarInfoComercio(totalInfo, (resp) => {
      showMessage("Realizado correctamente")

      setInfoComercio(totalInfo)
      setInputValues(totalInfo)

      hideLoading()
      setCambioAlgo(false)
    }, showMessageLoading)

  }


  useEffect(() => {
    // console.log("cambio inputs.. algun cambio?", someChangeInput())
    setCambioAlgo(someChangeInput())
  }, [inputs])

  const enviarImagen = () => {
    showLoading("Subiendo imagen")
    Shop.enviarImagen(image, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.status) {
        setInfoComercio(resp.info)
      }
      hideLoading()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }



  const conectarAMP = () => {
    getLinkConnectMp()
  }

  const getLinkConnectMp = () => {
    if (linkToConnectMp == "") {
      showLoading("Generando coneccion con mp")
      Shop.getLinkMp(infoComercio, (resp) => {
        // console.log("respuesta del servidor", resp)
        hideLoading()
        if (resp.status) {

          open(resp.link, "_bank")
          setLinkToConnectMp(resp.link)

          setCheckingConnectMp(true)
        }
      }, (er) => {
        hideLoading()
        showMessage(er)
      })
    } else {
      open(linkToConnectMp, "_bank")
      setCheckingConnectMp(true)

    }
  }
  const checkConeccionAMP = () => {
    showLoading("Revisando coneccion con mp")
    Shop.checkConeccionMP(infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      hideLoading()
      setCheckingConnectMp(false)
      if (resp.status) {
        setHasConnectionMp(true)
      }
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  useEffect(() => {
    if (tabNumber != TAB_INDEX) return
    onLoad();
  }, [tabNumber]);



  useEffect(() => {

    // console.log("cambio infocomercio", infoComercio)
    if (infoComercio) {
      if (infoComercio.extras != "") {
        const ex = JSON.parse(infoComercio.extras);
        // console.log("ex", ex)
        if (ex && ex.mp && ex.mp.access_token) {
          setHasConnectionMp(true)
        } else {
          setHasConnectionMp(false)
        }
      }
    }
  }, [infoComercio]);


  return (
    <TabPanel value={tabNumber} index={TAB_INDEX}>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>


          {infoComercio && (


            <div>

              <h5>Imagen</h5>
              <div>
                {infoComercio.image != "" && (
                  <img
                    style={{
                      width: "130px"
                    }}
                    src={("https://softus.com.ar/images/shops/" + infoComercio.image)} />
                )}
                <br />
                <InputFile
                  inputState={[image, setImage]}
                  validationState={[val_image, setVal_image]}
                  extensions="jpg"
                  label={"Seleccionar imagen"}
                  fileInputLabel={(infoComercio.image != "" ? "cambiar imagen" : "seleccionar imagen")}
                />

                {image != "" && (
                  <SmallButton textButton={"Enviar imagen"} actionButton={enviarImagen} />
                )}

              </div>


              <h4 style={{
                textAlign: "left",
                marginTop: "30px"
              }}>Informacion de la tienda</h4>


              <InputName
                inputState={inputs.name}
                validationState={validations.name}
                label={"Nombre"}
                withLabel={false}
              />

              <InputPage
                inputState={inputs.url}
                validationState={validations.url}
                label={"Url de la tienda"}
                withLabel={false}
              />

              <InputGeneric
                isDecimal={true}
                inputState={inputs.full_adress}
                validationState={validations.full_adress}
                label={"Direccion"}
                withLabel={false}
              />

              <InputName
                inputState={inputs.description}
                validationState={validations.description}
                label={"Descripcion"}
                withLabel={false}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"Rut"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.unique_doc}
              />


              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>

                  <h4 style={{
                    textAlign: "left",
                    marginTop: "30px"
                  }}>Posicion Gps de la tienda</h4>

                </Grid>

                <Grid item xs={12} lg={12}>

                  <InputGeneric
                    isDecimal={true}
                    inputState={inputs.gps_position}
                    validationState={validations.gps_position}
                    label={"Gps"}
                    withLabel={false}
                  />


                </Grid>

                <Grid item xs={12} lg={12}>
                  {infoComercio.gps_position != "" && (
                    <SmallButton textButton={"Ver en mapa"} actionButton={() => {
                      // -34.566302, -58.543924
                      const coords = inputs.gps_position[0].replaceAll(" ", "").split(",")
                      const lat = coords[0]
                      const lon = coords[1]

                      var lk = "https://www.google.com/maps/search/" + lat + "," + lon

                      window.open(lk, "_blank")
                    }} />
                  )}
                  <SmallButton
                    textButton={((infoComercio.gps_position != "") ? "Cambiar Posicion Gps" : "Asignar Posicion GPS")}
                    style={{
                      width: "300px"
                    }}
                    actionButton={() => {


                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
                          enableHighAccuracy: true,
                          timeout: 5000, // 5 segundos de tiempo máximo para obtener la posición
                          maximumAge: 0 // No usar una posición en caché anterior
                        });
                      } else {
                        showMessage("La geolocalización no está disponible en este navegador.");
                      }

                      function successCallback(position) {
                        const latitud = position.coords.latitude;
                        const longitud = position.coords.longitude;
                        console.log("actualiza gps", latitud, "..", longitud)
                        // callbackOk(latitud, longitud)
                        inputs.gps_position[1](latitud + ", " + longitud)
                        showMessage("Capturado gps correctamente")
                        // -34.543082, -58.575656

                        // -34.566302, -58.543924
                      }

                      function errorCallback(error) {
                        showAlert(error)
                      }




                    }} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>

                  <h4 style={{
                    textAlign: "left",
                    marginTop: "30px"
                  }}>Horarios</h4>

                </Grid>

                <Grid item xs={6} lg={6}>

                  <InputGeneric
                    isDecimal={true}
                    inputState={inputs.time_start}
                    validationState={validations.time_start}
                    label={"Apertura"}
                    withLabel={false}
                  />

                </Grid>
                <Grid item xs={6} lg={6}>

                  <InputGeneric
                    isDecimal={true}
                    inputState={inputs.time_end}
                    validationState={validations.time_end}
                    label={"Cierre"}
                    withLabel={false}
                  />

                  <br />
                  <br />
                  <br />
                </Grid>

              </Grid>



              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>
                  <SmallButton
                    textButton={"Guardar cambios"}
                    style={{ width: "250px" }}
                    isDisabled={!cambioAlgo}
                    actionButton={actualizarInfoComercio}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <SmallSecondaryButton
                    textButton={"Tarifas de envios"}
                    style={{ width: "100%" }}
                    actionButton={() => setShowZones(true)}
                  />

                  <ShopDeliveryZones infoComercio={infoComercio} setOpenDialog={setShowZones} openDialog={showZones} />
                  <ShopDeliveryTimes infoComercio={infoComercio} setOpenDialog={setShowTimes} openDialog={showTimes} />

                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <SmallSecondaryButton
                    textButton={"Horarios entregas programadas"}
                    style={{ width: "100%" }}
                    actionButton={() => setShowTimes(true)}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <br />
                  <br />
                  <br />
                </Grid>
              </Grid>


            </div>

          )}

          {!checkingConnectMp ? (
            <div>
              {infoComercio && !hasConnectionMp && (
                <SmallButton textButton="conectar a mp" actionButton={conectarAMP} />
              )}


              {infoComercio && hasConnectionMp && (
                <Typography>Conectado a MP correctamente</Typography>
              )}
            </div>
          ) : (
            <div>
              <SmallButton textButton="Revisar coneccion MP" actionButton={checkConeccionAMP} />
            </div>
          )}

        </Grid>

        <div style={{
          width: "100%",
          height: "50px",
        }}></div>


      </Grid>

    </TabPanel >
  );
};

export default AdminConfigTabShop;
