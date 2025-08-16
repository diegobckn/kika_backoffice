import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TextField,
  ListItemIcon,
  SvgIcon,
  Icon
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";

import Stack from '@mui/material/Stack';



import CircularProgress from '@mui/material/CircularProgress';

import RefreshIcon from '@mui/icons-material/Refresh';
import CambiarUnaConfigSesion from "../ScreenDialog/CambiarUnaConfigSesion";
import { VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";

const RefreshInfoControl = ({
  variableEnSesion,
  fetchInfo,// = () => { console.log("fetch vacio original") }//fun async
}) => {


  const [tiempoRefresh, setTiempoRefresh] = useState(-1)
  const [cargandoInfo, setCargandoInfo] = useState(false)

  useEffect(() => {
    // console.log("variableEnSesion", variableEnSesion)
    if (variableEnSesion != '') {
      setTiempoRefresh(ModelConfig.get(variableEnSesion))
      // console.log("empezando ciclo")
    }
  }, [variableEnSesion])

  useEffect(() => {
    // console.log("tiempoRefresh", tiempoRefresh)
    if (tiempoRefresh !== -1) {
      cicloTiempoRefresh()
    }
  }, [tiempoRefresh])

  const cicloTiempoRefresh = async () => {
    if (cargandoInfo) {
      setTimeout(() => {
        cicloTiempoRefresh()
      }, 1 * 1000);
      return
    }
    var nuevoTiempo = tiempoRefresh - 1

    // console.log("nuevoTiempo", nuevoTiempo)
    if (nuevoTiempo < 0) {
      setCargandoInfo(true)

      if (typeof (fetchInfo) == "function") {
        await fetchInfo()
      }

      setCargandoInfo(false)
      nuevoTiempo = await ModelConfig.get(variableEnSesion)

      // try {
      //   console.log("typeof(fetchInfo)", typeof(fetchInfo))
      //   // await fetchInfo().finally(() => { })
      // } catch (err) {
      //   // console.log("error fetch refresh", err)
      // } finally {
      //   setTimeout(() => {
      //     setCargandoInfo(false)
      //     nuevoTiempo = ModelConfig.get(variableEnSesion)
      //     setTiempoRefresh(nuevoTiempo)
      //   }, 1 * 1000);
      // }
      // return
    }
    // console.log("cicloTiempoRefresh..nuevoTiempo", nuevoTiempo)

    setTimeout(() => {
      setTiempoRefresh(nuevoTiempo)
    }, 1 * 1000);
  }

  const [showCambiar, setShowCambiar] = useState(false)

  return (
    <>
      <Button sx={{
        position: "absolute",
        right: "10px",

        width: (((ModelConfig.get(variableEnSesion) + "").length + 1) * 14) + "px",
        height: (((ModelConfig.get(variableEnSesion) + "").length + 1) * 14) + "px",
        textAlign: "center",
        verticalAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "15px 40px",

        borderRadius: "50%",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "0",
        minWidth: "0",

        background: "transparent",
        color: "black",
        "&:hover": {
          background: "transparent",
          color: "black",
        }
      }}
        onClick={() => {
          setShowCambiar(true)
        }}
      >
        {tiempoRefresh >= 0 ? (
          <Typography
            sx={{
              color: "#D4D3D3",
            }}
          >
            <CircularProgress
              variant="determinate"
              value={(tiempoRefresh * 100 / ModelConfig.get(variableEnSesion))}
              size={((((ModelConfig.get(variableEnSesion) + "").length + 1) * 14))}
              sx={{
                position: "absolute",
                top: "0px",
                color: "#E6E5E5",
                right: "0px"
              }}
            />
            {tiempoRefresh}
          </Typography>
        ) : (
          <Typography>
            <VisibilityOff />
          </Typography>
        )}


      </Button >
      <CambiarUnaConfigSesion
        openDialog={showCambiar}
        setOpenDialog={setShowCambiar}
        nameConfig={variableEnSesion}
        label={"Tiempo recargar info"}
        onChange={(nv) => {
          // setTiempoRefresh(0)
          // cicloTiempoRefresh()
          // setTiempoRefresh(-1)

          window.location.href = window.location.href
        }}

        extraButonValue={[{
          text: "1 min",
          value: 60
        }, {
          text: "No actualizar",
          value: -1
        },
        {
          text: "Muy rapido",
          value: 1
        },
        ]}

      />
    </>
  );
};

export default RefreshInfoControl;
