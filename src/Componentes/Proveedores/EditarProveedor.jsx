/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  TextField,
  Button,
  Grid,
  Box,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";
import Comuna from "../../Models/Comuna";
import Region from "../../Models/Region";
import Proveedor from "../../Models/Proveedor";

const EditarProveedor = ({
  open,
  handleClose,
  proveedor = null,
  fetchProveedores,
  onEditSuccess,
}) => {

  const apiUrl = ModelConfig.get().urlBase;
  const [editProveedor, setEditProveedor] = useState(null);

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditSuccessful, setIsEditSuccessful] = useState(false);
  const [comunas, setComunas] = useState([]);
  const [regions, setRegions] = useState([]);


  const findComuns = (regionId)=>{
    Comuna.getInstance().findByRegion( regionId, (comunasx)=>{
      setComunas(comunasx)
    },(err)=>{
    })


  }
  useEffect(() => {
    if(!open) return 
    if (proveedor) {
      const proveedorEditar = proveedor

      Region.getInstance().getAll((regionsx)=>{
        setRegions(regionsx)
      },(err)=>{
      })

      findComuns(parseInt(proveedorEditar.region))
      setEditProveedor(proveedorEditar);
      console.log("proveedorEditar")
      console.log(proveedorEditar)
    }
  }, [open]);

  useEffect(()=>{

    if(comunas.length>0 && Number.isNaN(parseInt(editProveedor.comuna))){
      var finded = 0
      comunas.forEach((com)=>{
        if(com.comunaNombre == editProveedor.comuna){
          finded = com.id
        }
      })
      if(finded!=0){
        editProveedor.comuna = finded
        setEditProveedor(editProveedor);
      }
    }


  }, [comunas]);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditProveedor((prevEditProveedor) => ({
      ...prevEditProveedor,
      [name]: value,
    }));
  };
  const closeSuccessDialog = () => {
    setSuccessDialogOpen(false);
    handleClose();
    onEditSuccess()
  };

  const closeErrorDialog = () => {
    setOpenErrorDialog(false);
  };
  const handleEdit = (proveedor) => {
    setEditProveedor(proveedor);

    setIsEditSuccessful(false); // Reset the edit success state
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    Proveedor.getInstance().update(editProveedor,(resp)=>{
      console.log("Proveedor updated successfully:", resp.data);
      setIsEditSuccessful(true)
      setSuccessDialogOpen(true)
      

    
      // fetchProveedores((prevProduct) => {
      //   if(!prevProduct)return
      //   console.log("prevProduct")
      //   console.log(prevProduct)
      //   var ls = [
      //     ...prevProduct
      //   ]
      //   ls[editProveedor.index] = editProveedor
      //   return(ls)
      // });
    },(error)=>{
      console.error("Error updating proveedor:", error);
      setErrorMessage(error.message);
      setOpenErrorDialog(true);
    })
  };

  


  return editProveedor!= null ?(

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "90vw",
          border: "rounded",
        }}
      >
        <h2 id="modal-modal-title">Editar Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Código Proveedor"
                name="codigoProveedor"
                value={editProveedor.codigoProveedor}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Razón Social"
                name="razonSocial"
                value={editProveedor.razonSocial}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Giro"
                name="giro"
                value={editProveedor.giro}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="RUT"
                name="rut"
                value={editProveedor.rut}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Email"
                name="email"
                value={editProveedor.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={editProveedor.telefono}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Dirección"
                name="direccion"
                value={editProveedor.direccion}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
            <Select
                fullWidth
                value={editProveedor.region + ""}
                onChange={(e) => {

                  setEditProveedor((prevProduct) => ({
                    ...prevProduct,
                    region: e.target.value + "",
                    comuna: "0",
                  }));

                  findComuns(e.target.value)

                }}
                label="Selecciona Region"
              >
                {regions.map((region) => (
                  <MenuItem 
                  key={region.id} 
                  value={region.id}>
                    {region.regionNombre}
                  </MenuItem>
                ))}
              </Select>

            


            </Grid>
            <Grid item xs={12} sm={3}>
              
            <Select
              fullWidth
              value={editProveedor.comuna + ""}
              onChange={(e) => {
                setEditProveedor((prevProduct) => ({
                  ...prevProduct,
                  comuna: e.target.value + "",
                }));
              }}
              label="Selecciona Comuna"
            >
              {comunas.map((comuna) => (
                <MenuItem 
                key={comuna.id} 
                value={comuna.id}>
                  {comuna.comunaNombre}
                </MenuItem>
              ))}
            </Select>

            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Página"
                name="pagina"
                value={editProveedor.pagina}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Forma de Pago"
                name="formaPago"
                value={editProveedor.formaPago}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Nombre Responsable"
                name="nombreResponsable"
                value={editProveedor.nombreResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Correo Responsable"
                name="correoResponsable"
                value={editProveedor.correoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Teléfono Responsable"
                name="telefonoResponsable"
                value={editProveedor.telefonoResponsable}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Sucursal"
                name="sucursal"
                value={editProveedor.sucursal}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </form>
        {isEditSuccessful && (
          <Dialog open={successDialogOpen} onClose={closeSuccessDialog}>
            <DialogTitle> Edición Exitosa </DialogTitle>
            <DialogContent>
              <Typography>El Proveedor fue editado con éxito</Typography>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={openErrorDialog} onClose={closeErrorDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
            <DialogContentText>
              Ingrese uno nuevo y repita el proceso
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeErrorDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  ):(
    <></>
  );
};

export default EditarProveedor;
