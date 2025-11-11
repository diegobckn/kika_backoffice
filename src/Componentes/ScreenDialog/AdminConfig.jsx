import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  DialogTitle,
  Tabs,
  Tab,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import AdminConfigTabGeneral from "./AdminConfigTabGeneral";
import AdminConfigTabComercio from "./AdminConfigTabComercio";
import AdminConfigTabImpresion from "./AdminConfigTabImpresion";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import AdminConfigTabSimpleApi from "./AdminConfigTabSimpleApi";
import AdminConfigTabShop from "./AdminConfigTabShop";


const AdminConfig = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    showMessage,
    showLoading,
    showConfirm,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [someChage, setSomeChange] = useState(false)

  const [tabNumber, setTabNumber] = useState(0)
  const handleChange = (event, newValue) => {
    if (someChage) {
      showConfirm("Hay cambios sin guardar. ¿Quiere ignoralos y continuar?", () => {
        setTabNumber(newValue);
        setSomeChange(false)
      })
    } else {
      setTabNumber(newValue);
    }
  };

  const closeModal = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    if (!openDialog) return
    setSomeChange(false)
  }, [openDialog])

  return (
    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        Configuraciones
      </DialogTitle>
      <DialogContent>
        <Grid container item xs={12} spacing={2} sx={{
          minWidth: "400px",
          marginTop: "0px"
        }}>


          <Grid item xs={12}>
            {/* Tabs component */}
            <Tabs value={tabNumber} onChange={handleChange}>
              {/* Individual tabs */}
              <Tab label="General" />
              <Tab label="Comercio" />
              <Tab label="Impresion" />
              <Tab label="Simple Api" />
              <Tab label="Tienda" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <AdminConfigTabGeneral tabNumber={tabNumber} setSomeChange={setSomeChange} closeModal={closeModal} />
            <AdminConfigTabComercio tabNumber={tabNumber} setSomeChange={setSomeChange} closeModal={closeModal} />
            <AdminConfigTabImpresion tabNumber={tabNumber} setSomeChange={setSomeChange} closeModal={closeModal} />
            <AdminConfigTabSimpleApi tabNumber={tabNumber} setSomeChange={setSomeChange} closeModal={closeModal} />
            <AdminConfigTabShop tabNumber={tabNumber} setSomeChange={setSomeChange} closeModal={closeModal} />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>Atras</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminConfig;
