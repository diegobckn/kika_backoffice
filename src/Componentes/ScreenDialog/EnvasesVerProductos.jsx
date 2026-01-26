import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import InputName from "../Elements/Compuestos/InputName";
import InputNumber from "../Elements/Compuestos/InputNumber";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import Shop from "../../Models/Shop";
import dayjs from "dayjs";
import Product from "../../Models/Product";
import Model from "../../Models/Model";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
export const defaultTheme = createTheme();

export default function ({
  openDialog,
  setOpenDialog,
  envase,
}) {
  const {
    showAlert,
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [products, setProducts] = useState([])

  const loadProds = () => {
    console.log("envase", envase)
    Product.getInstance().getAll((prods) => {
      console.log("prods", prods)
      const prodsOk = []
      prods.forEach((prod) => {
        console.log("prod.envase.length", prod.envase.length)
        if (prod.envase.length > 0) {
          console.log("prod.envase[0].descripcion", prod.envase[0].descripcion)
        }

        if (prod.envase.length > 0 && prod.envase[0].descripcion == envase.grupo) {
          prodsOk.push(prod)
        }
      })
      console.log("prodsOk", prodsOk)
      setProducts(prodsOk)
    }, showAlert)
  }

  useEffect(() => {
    loadProds()
  }, [openDialog])

  return (
    <Dialog open={openDialog} maxWidth="sm" fullWidth onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        Productos para {envase.grupo}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{
          margin: "10px 0",
          padding: "10px 0",
          textAlign: "left",
          // backgroundColor:"red"
        }}>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "gainsboro" }}>
                    <TableCell>Codigo</TableCell>
                    <TableCell>Nombre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((prod, ix) => (
                    <TableRow key={ix}>
                      <TableCell>
                        {prod.idProducto}
                      </TableCell>
                      <TableCell>
                        {prod.nombre}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Atras</Button>
      </DialogActions>
    </Dialog >
  );
}
