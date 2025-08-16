import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";

import InputRutUsuario from "../../Elements/Compuestos/InputRutUsuario";
import InputName from "../../Elements/Compuestos/InputName";
import InputEmail from "../../Elements/Compuestos/InputEmail";
import InputPhone from "../../Elements/Compuestos/InputPhone";
import InputNumber from "../../Elements/Compuestos/InputNumber";
import InputPassword from "../../Elements/Compuestos/InputPassword";
import SelectList from "../../Elements/Compuestos/SelectList";
import SelectUserRoles from "../../Elements/Compuestos/SelectUserRoles";
import SelectRegion from "../../Elements/Compuestos/SelectRegion";
import SelectComuna from "../../Elements/Compuestos/SelectComuna";
import SendingButton from "../../Elements/SendingButton";
import User from "../../../Models/User";
import System from "../../../Helpers/System";
import FormUsuario from "./FormUsuario";
export const defaultTheme = createTheme();

export default function Ingreso({
  onSave,
  openDialog,
  setOpendialog
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpendialog(false)
    }} maxWidth={'lg'}>

      <Paper elevation={16} square>
        <FormUsuario
          onSave={() => {
            setOpendialog(false)
            onSave()
          }}
          onCancel={() => {
            setOpendialog(false)
          }}
        />

      </Paper>
    </Dialog>
  );
}
