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
import InputFile from "./InputFile";
import Product from "../../../Models/Product";
import InputFileImageResize from "./InputFileImageResize";
import System from "../../../Helpers/System";


export default ({
  topic,
  unique,
  product = null
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

  const [imageResize, setImageResize] = useState("")
  const [val_image_resize, setVal_image_resize] = useState(null)


  useEffect(() => {
    cargarImagen()
  }, [])

  useEffect(() => {
    // console.log("cambio imagen", image)
    if (typeof (image) == "object" && image) {
      // console.log("actuaizar imagen")
      enviarImagen()
    } else if (image === null) {
      cargarImagen()
    }
    // console.log("tipo de imagen", typeof (image))
  }, [image])



  useEffect(() => {
    console.log("cambio imagenresize", imageResize)
    if (typeof (imageResize) == "object" && imageResize) {
      // console.log("actuaizar imagen")
      enviarImagenResize()
    } else if (imageResize === null) {
      console.log("es null")
      // cargarImagen()
    }
    // console.log("tipo de imagen", typeof (image))
  }, [imageResize])




  const enviarImagen = () => {
    // console.log("enviarImagen")
    showLoading("Subiendo imagen")
    Product.signarImagen(product, image, (resp) => {
      hideLoading()
      cargarImagen()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  const enviarImagenResize = () => {
    // console.log("enviarImagen")
    showLoading("Subiendo imagen para achicar")
    Product.signarImagenResize(product, imageResize, (resp) => {
      hideLoading()
      cargarImagen()
    }, (er) => {
      hideLoading()
      showMessage(er)
    })
  }

  const cargarImagen = () => {
    showLoading("Cargando imagen")
    Product.cargarImagen(product, (urlImagen) => {
      setImage(urlImagen)
      hideLoading()
    })
  }


  return <div style={{
    padding: "10px",
    backgroundColor: "#f0f0f0",
    textAlign: (System.isMobile() ? "center" : undefined)
  }}>
    <h5>Imagen</h5>
    {image != "" && (typeof (image) == "string") && (
      <img
        style={{
          width: "130px"
        }}
        src={image}
      />
    )}
    <br />
    <InputFile
      inputState={[image, setImage]}
      validationState={[val_image, setVal_image]}
      extensions="jpg"
      withLabel={false}
      fileInputLabel={(image != "" ? "cambiar imagen" : "seleccionar imagen")}
      canDelete={false}
    />

    <InputFileImageResize
      inputState={[imageResize, setImageResize]}
      validationState={[val_image_resize, setVal_image_resize]}
      extensions="jpg,jpeg"
      withLabel={false}
      fileInputLabel={(image != "" ? "cambiar y achicar imagen" : "seleccionar y achicar imagen")}
      canDelete={false}
    />
  </div>
};

