import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Typography,
  TableContainer,
  Grid,
  Box,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import StorageSesion from "../../Helpers/StorageSesion";
import SmallDangerButton from "../Elements/SmallDangerButton";
import LogObject from "../../Models/LogObject";


const AdminStorage = ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showConfirm,
    showAlert,
    showLoading,
    hideLoading,
  } = useContext(SelectedOptionsContext);

  const [names, setNames] = useState([])
  const [info, setInfo] = useState([])
  const [totalSize, setTotalSize] = useState(0)

  const ses = new StorageSesion("x")


  const cargarInfo = () => {
    showLoading("Cargando...")
    // console.log("cargarInfo")
    const all = ses.getAll()
    setInfo(all)
    // console.log("length", all.length)
    // console.log("keys", Object.keys(all))
    setNames(Object.keys(all).filter((nm) => (nm != "length"
      && nm != "clear"
      && nm != "key"
      && nm != "getItem"
      && nm != "removeItem"
      && nm != "setItem")
    ))

    hideLoading()
  }

  const cargaExtras = () => {
    var tamTotal = 0
    names.forEach((name, ix) => {
      tamTotal += info[name].length
    })
    setTotalSize(tamTotal)
  }

  useEffect(() => {
    cargaExtras()
  }, [names])

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Admin Memoria
      </DialogTitle>
      <DialogContent>

        <TableContainer sx={{
          marginBottom: "50px",
        }}>
          <Table sx={{
            maxHeight: "50vh",
            width: "70vw",
            display: "block",
            // backgroundColor: "red",
            overflow: "auto"
          }}>
            <TableHead>
              <TableRow sx={{
                backgroundColor: "gainsboro",
              }}>
                <TableCell>#</TableCell>
                <TableCell>Propiedad</TableCell>
                <TableCell>Tamaño</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {names.map((nm, ix) => {
                return (
                  <TableRow key={ix}>
                    <TableCell>{ix + 1}</TableCell>
                    <TableCell>{nm}</TableCell>
                    <TableCell>{System.formatMonedaLocal(info[nm].length, false)}</TableCell>
                    <TableCell>
                      <SmallButton
                        textButton={"Ver"}
                        actionButton={() => {
                          showAlert(<textarea cols={100} rows={50} value={LogObject(info[nm])} readOnly />)
                          // showAlert(<textarea cols={100} rows={50} value={info[nm]} readOnly />)
                        }}
                      />

                      <SmallDangerButton
                        textButton={"Eliminar"}
                        actionButton={() => {
                          showConfirm("Eliminar '" + nm + "'?", () => {
                            const x = localStorage.removeItem(nm)
                            setTimeout(() => {
                              cargarInfo()
                            }, 300);
                          }, () => { })
                        }}
                      />
                    </TableCell>
                  </TableRow>
                )
              }
              )}

              <TableRow sx={{
                backgroundColor: "gainsboro",
              }}>
                <TableCell colSpan={2} sx={{
                  textAlign: "right"
                }}>Total:</TableCell>
                <TableCell>{System.formatMonedaLocal(totalSize, false)}</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>


          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Box sx={{
          width: "100%",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f3f3f3"
        }}>



          <SmallButton
            actionButton={() => {
              cargarInfo()
            }}

            textButton={"Cargar"}
          />
          <SmallButton
            actionButton={() => {
              setOpenDialog(false)
            }}

            textButton={"Volver"}
          />
        </Box>
        {/* <SmallButton textButton="Guardar" actionButton={handlerSaveAction} /> */}
      </DialogActions>
    </Dialog>
  );
};

export default AdminStorage;
