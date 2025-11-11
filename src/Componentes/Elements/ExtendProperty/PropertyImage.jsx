import React, { useState, useContext, useEffect, useRef } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Button,
  Typography,
  Tooltip
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Backup, ChangeCircle, Check, Close, CloudDone, Dangerous, Task } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";
import StorageSesion from "../../../Helpers/StorageSesion";
import Shop from "../../../Models/Shop";
import InputFile from "../Compuestos/InputFile";


const PropertyImage = ({
  topic,
  unique
}) => {

  const {
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  // funcionalidad imagen
  const [image, setImage] = useState("")
  const [val_image, setVal_image] = useState(null)

  const [infoComercio, setInfoComercio] = useState(null)

  useEffect(() => {
    var comSes = new StorageSesion("comercio")
    if (comSes.hasOne()) {
      setInfoComercio(comSes.cargar(1))
    }
  }, [])


  useEffect(() => {
    if (infoComercio) {
      // console.log("cambio info comercio", infoComercio)
      // if (isEdit) {
      cargarImagen()
      // }
    }
  }, [infoComercio])

  useEffect(() => {
    // console.log("cambio imagen", image)
    if (typeof (image) == "object" && image) {
      // console.log("actuaizar imagen")
      enviarImagen()
    }
    // console.log("tipo de imagen", typeof (image))
  }, [image])



  const eliminarImagen = () => {
    showLoading("Eliminando imagen")
    Shop.eliminarImagenProperty(topic, unique, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.status) {
        setImage(resp.info.value)
      }
      hideLoading()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  const enviarImagen = () => {
    showLoading("Subiendo imagen")
    Shop.enviarImagenProperty(topic, unique, image, infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      if (resp.status) {
        setImage(resp.info.value)
      }
      hideLoading()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  const cargarImagen = () => {
    showLoading("Cargando imagen")
    Shop.getProperty(topic, unique, "image", infoComercio, (resp) => {
      // console.log("respuesta del servidor", resp)
      setImage(resp.info)
      hideLoading()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }


  return infoComercio ? (<div style={{
    padding: "10px",
    backgroundColor: "#f0f0f0",
  }}>
    <h5>Imagen</h5>
    {image != "" && (typeof (image) == "string") && (
      <img
        style={{
          width: "130px"
        }}
        src={("https://softus.com.ar/images/properties/" + image)} />
    )}
    <br />
    <InputFile
      inputState={[image, setImage]}
      validationState={[val_image, setVal_image]}
      extensions="jpg,jpeg,png,webp"
      withLabel={false}
      fileInputLabel={(image != "" ? "cambiar imagen" : "seleccionar imagen")}
      onDelete={() => {
        // console.log("debe eliminar imagen")
        eliminarImagen()
      }}
    />
  </div>
  ) : (
    <></>
  );
};

export default PropertyImage;
