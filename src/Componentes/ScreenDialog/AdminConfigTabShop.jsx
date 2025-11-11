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


  const onLoad = () => {
    getInfoComercio((infoCom) => {
      // console.log("info de comercio", infoCom)
      infoCom.url_base = ModelConfig.get("urlBase")


      showLoading("Buscando informacion del servidor...")
      Shop.prepare(infoCom, (response) => {
        hideLoading()
        // console.log("respuesta de softus", response)
        setInfoComercio(response.info)
      }, showMessageLoading)
    })

  }

  const cambiaInfoComercio = (campo, valor) => {
    infoComercio[campo] = valor

    const cp = System.clone(infoComercio)
    delete (infoComercio.campo)

    setInfoComercio(infoComercio)
    setTimeout(() => {
      setInfoComercio(cp)
    }, 10);

  }

  const actualizarInfoComercio = () => {
    showLoading("Actualizando informacion del comercio")
    Shop.actualizarInfoComercio(infoComercio, (resp) => {
      showMessage("Realizado correctamente")
      hideLoading()
      setCambioAlgo(false)
    }, showMessageLoading)

  }


  useEffect(() => {
    setCambioAlgo(true)
  }, [infoComercio])

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
              <TextField
                margin="normal"
                fullWidth
                label={"Nombre"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.name}
                onChange={(e) => cambiaInfoComercio("name", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"url de la tienda"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.url}
                onChange={(e) => cambiaInfoComercio("url", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"Descripcion"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.description}
                onChange={(e) => cambiaInfoComercio("description", e.target.value)}
              />

              <TextField
                margin="normal"
                fullWidth
                label={"Rut"}
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={infoComercio.unique_doc}
                onChange={(e) => cambiaInfoComercio("unique_doc", e.target.value)}
              />


              <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>

                  <h4 style={{
                    textAlign: "left",
                    marginTop: "30px"
                  }}>Posicion Gps de la tienda</h4>

                </Grid>

                <Grid item xs={12} lg={12}>


                  <TextField
                    margin="normal"
                    fullWidth
                    label={"Gps"}
                    type="text" // Cambia dinámicamente el tipo del campo de contraseña
                    value={infoComercio.gps_position}
                    onChange={(e) => cambiaInfoComercio("gps_position", e.target.value)}
                  />

                </Grid>

                <Grid item xs={12} lg={12}>
                  {infoComercio.gps_position != "" && (
                    <SmallButton textButton={"Ver en mapa"} actionButton={() => {
                      // -34.566302, -58.543924
                      const coords = infoComercio.gps_position.replaceAll(" ", "").split(",")
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
                        cambiaInfoComercio("gps_position", latitud + ", " + longitud)
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
                  <TextField
                    margin="normal"
                    fullWidth
                    label={"Apertura"}
                    type="text" // Cambia dinámicamente el tipo del campo de contraseña
                    value={infoComercio.time_start}
                    onChange={(e) => cambiaInfoComercio("time_start", e.target.value)}
                  />
                </Grid>
                <Grid item xs={6} lg={6}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label={"Cierre"}
                    type="text" // Cambia dinámicamente el tipo del campo de contraseña
                    value={infoComercio.time_end}
                    onChange={(e) => cambiaInfoComercio("time_end", e.target.value)}
                  />

                  <br />
                  <br />
                  <br />
                </Grid>

              </Grid>





              <SmallButton
                textButton={"Guardar cambios"}
                style={{ width: "250px" }}
                isDisabled={!cambioAlgo}
                actionButton={actualizarInfoComercio}
              />


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
