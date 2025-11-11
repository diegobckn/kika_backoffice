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


const AdminConfigTabGeneral = ({
  tabNumber,
  setSomeChange,
  closeModal = () => { }
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const TAB_INDEX = 0

  const [urlBase, setUrlBase] = useState("");
  const [iva, setIva] = useState("");

  const [porcentajeMargen, setPorcentajeMargen] = useState(0);

  const [criterioCostoComercio, setCriterioCostoComercio] = useState(null)
  const [idEmpresa, setIdEmpresa] = useState(0)


  const loadConfigSesion = () => {
    setUrlBase(ModelConfig.get("urlBase"))
    setIva(ModelConfig.get("iva"))
    setPorcentajeMargen(ModelConfig.get("porcentajeMargen"))
    setCriterioCostoComercio(ModelConfig.get("criterioCostoComercio"))
    setIdEmpresa(ModelConfig.get("idEmpresa"))
  }

  const confirmSave = (close = false) => {
    ModelConfig.change("urlBase", urlBase);
    ModelConfig.change("iva", iva)
    ModelConfig.change("porcentajeMargen", porcentajeMargen)
    ModelConfig.change("criterioCostoComercio", criterioCostoComercio)
    ModelConfig.change("idEmpresa", idEmpresa)

    showMessage("Guardado correctamente")
    setSomeChange(false)
    if (close) {
      closeModal();
    }
  }

  useEffect(() => {
    if (tabNumber != TAB_INDEX) return
    loadConfigSesion();
  }, [tabNumber]);


  return (
    <TabPanel value={tabNumber} index={TAB_INDEX}>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
          <TextField
            margin="normal"
            fullWidth
            label="UrlBase"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={urlBase}
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setUrlBase(e.target.value)}
          />

        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            margin="normal"
            fullWidth
            label="Iva"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={iva}
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setIva(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            margin="normal"
            fullWidth
            label="Porcentaje Margen ganancia"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={porcentajeMargen}
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setPorcentajeMargen(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <Typography sx={{ textAlign: "left" }}>Precio de costo</Typography>
          <BoxOptionList
            optionSelected={criterioCostoComercio}
            setOptionSelected={setCriterioCostoComercio}
            options={
              Object.keys(CriterioCosto).map((key) => {
                return {
                  id: CriterioCosto[key],
                  value: key
                }
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6}>
          <TextField
            margin="normal"
            fullWidth
            label="Id Empresa(Mype)"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={idEmpresa}
            onKeyDown={() => { setSomeChange(true) }}
            onChange={(e) => setIdEmpresa(e.target.value)}
          />
        </Grid>

        <div style={{
          width: "100%",
          height: "50px",
        }}></div>


        <SmallButton textButton="Guardar" actionButton={confirmSave} />
        <SmallButton textButton="Guardar y salir" actionButton={() => confirmSave(true)} />

      </Grid>

    </TabPanel >
  );
};

export default AdminConfigTabGeneral;
