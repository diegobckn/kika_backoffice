import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  Chip,
  Typography,
  Snackbar,
  InputLabel,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Icon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import SmallButton from "../Elements/SmallButton";
import ArrowDown from "@mui/icons-material/ArrowDropDown";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SelectList from "../Elements/Compuestos/SelectList";
import System from "../../Helpers/System";
import InputNumber from "../Elements/Compuestos/InputNumber";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import SelectRegion from "../Elements/Compuestos/SelectRegion";
import ImportarListaPrecio from "./ImportarListaPrecio";
import CrearListaPrecio from "./CrearListaPrecio";

const VALOR_APLICAR = [
  "Aumento",
  "Descuento",
]

export default ({
  openDialog,
  setOpendialog = (x) => { }
}) => {


  const [showImport, setShowImport] = useState(false)
  const [showCrea, setShowCrea] = useState(false)

  const inputs = {
    aplica: useState(0),
    listaSelec: useState(-1),
    porcentaje: useState(0),
    monto: useState(0),
  }

  const validations = {
    aplica: useState(null),
    listaSelec: useState(null),
    porcentaje: useState(null),
    monto: useState(null),
  }

  return (<Dialog open={openDialog} onClose={() => setOpendialog(false)} fullWidth maxWidth={"lg"}>
    <DialogTitle>Precios por listado</DialogTitle>
    <DialogContent>

      <Grid container spacing={2}>


        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <SmallButton
                fullWidth
                textButton={"Crear lista de precios"}
                actionButton={() => setShowCrea(true)} />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <SmallButton
                fullWidth
                textButton={"Importar lista de precios"}
                actionButton={() => setShowImport(true)} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>&nbsp;</Grid>


        <Grid item xs={12} sm={12} md={4} lg={4}>
          <br />
          <SelectRegion
            inputState={inputs.listaSelec}
            validationState={validations.listaSelec}
            label={"Lista seleccionada"}
            withLabel={false}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} sx={{
          position: "relative"
        }}>
          <br />
          <SelectList
            inputState={inputs.aplica}
            validationState={validations.aplica}
            selectItems={VALOR_APLICAR}
            label={"Aplica"}
            withLabel={false}
          />


        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Grid container spacing={2} sx={{
            // backgroundColor:"red",
            paddingTop: "8px"
          }}>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <InputGeneric
                inputState={["%", () => { }]}
                validationState={[null, () => { }]}
                label={""}
                withLabel={false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <InputNumber
                inputState={inputs.porcentaje}
                validationState={validations.porcentaje}
                label={""}
                withLabel={false}
                isDecimal={true}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <InputGeneric
                inputState={["$", () => { }]}
                validationState={[null, () => { }]}
                label={""}
                withLabel={false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <InputNumber
                inputState={inputs.monto}
                validationState={validations.monto}
                label={""}
                withLabel={false}
                isDecimal={true}
              />
            </Grid>
          </Grid>



        </Grid>
      </Grid>


      <Grid item xs={12} sm={12} md={10} lg={10}>
        <br />
        <br />
        <Typography>Productos</Typography>
        <Table sx={{ border: "1px ", borderRadius: "8px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Precio Venta</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>123465</TableCell>
              <TableCell>Papas</TableCell>
              <TableCell>$1200</TableCell>
              <TableCell>
                <SmallGrayButton textButton={"Editar"} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      <Grid item xs={12} sm={12} md={2} lg={2}>&nbsp;</Grid>

      <ImportarListaPrecio openDialog={showImport} setOpendialog={setShowImport} />
      <CrearListaPrecio openDialog={showCrea} setOpendialog={setShowCrea} />

    </DialogContent>



  </Dialog >);
};
