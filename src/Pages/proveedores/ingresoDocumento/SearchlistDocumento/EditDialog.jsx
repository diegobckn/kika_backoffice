import React, { useState} from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  MenuItem, 
  TableContainer, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Grid, 
  IconButton, 
  Select, 
  DialogActions, 
  Button,   
  Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EditDialog = ({
  editDialogOpen,
  handleCloseEditDialog,
  editFormData,
  handleEditFormChange,
  handleNumericKeyDown,
  handleEditDetailChange,
  handleOpenProduct,
  handleDeleteDetail,
  handleEditPaymentChange,
  handleEdit
}) => {
  // Check if there are any payment details
  const hasPaymentDetails = editFormData.proveedorCompraPagoUpdates.length > 0;
 

  return (
    <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
      <DialogTitle>Editar Documento </DialogTitle>
      <DialogContent>
      {hasPaymentDetails && (
          <Alert severity="warning" >
            No se puede editar debido a detalles de pago existentes.
            Borra y crea un nuevo documento de pago.
          </Alert>
        )}
        <TextField
          name="tipoDocumento"
          margin="dense"
          select
          label="Tipo de documento"
          value={editFormData.tipoDocumento}
          onChange={handleEditFormChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="Factura">Factura</MenuItem>
          <MenuItem value="Boleta">Boleta</MenuItem>
          <MenuItem value="Ticket">Ticket</MenuItem>
          <MenuItem value="Ingreso Interno">Ingreso Interno</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          name="folio"
          label="Folio"
          value={editFormData.folio}
          onChange={handleEditFormChange}
          onKeyDown={handleNumericKeyDown}
          fullWidth
        />

        <TextField
          margin="dense"
          name="total"
          label="Total"
          type="number"
          value={editFormData.total}
          onChange={handleEditFormChange}
          fullWidth
          onKeyDown={handleNumericKeyDown}
          inputProps={{
            readOnly: true,
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            sx={{ mt: 1 }}
            label="Fecha ingreso"
            value={
              editFormData.fechaIngreso
                ? dayjs(editFormData.fechaIngreso).format("DD/MM/YYYY")
                : ""
            }
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="dense"
          />
        </LocalizationProvider>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "gainsboro" }}>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unidad</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editFormData.proveedorCompraDetalleUpdates.map((detalle, index) => (
                <TableRow key={detalle.idDetalle}>
                  <TableCell sx={{ width: "30%" }}>
                    <TextField
                      margin="dense"
                      label="Descripción"
                      value={detalle.descripcionProducto}
                      onChange={(e) =>
                        handleEditDetailChange(
                          index,
                          "descripcionProducto",
                          e.target.value
                        )
                      }
                      fullWidth
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: "30%" }}>
                    <TextField
                      margin="dense"
                      label="Cantidad"
                      value={detalle.cantidad}
                      onChange={(e) =>
                        handleEditDetailChange(
                          index,
                          "cantidad",
                          e.target.value
                        )
                      }
                      fullWidth
                      onKeyDown={handleNumericKeyDown}
                    />
                  </TableCell>
                  <TableCell sx={{ width: "30%" }}>
                    <TextField
                      margin="dense"
                      label="Precio Unidad"
                      value={detalle.precioUnidad}
                      onChange={(e) =>
                        handleEditDetailChange(
                          index,
                          "precioUnidad",
                          e.target.value
                        )
                      }
                      fullWidth
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {detalle.cantidad * detalle.precioUnidad}
                  </TableCell>
                  <TableCell>
                    <Grid sx={{ display: "flex" }}>
                      <IconButton
                        onClick={() => handleOpenProduct(detalle)}
                        disabled={hasPaymentDetails} // Disable if there are payment details
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteDetail(index)}
                        disabled={hasPaymentDetails} // Disable if there are payment details
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "gainsboro" }}>
                <TableCell>Monto Pagado</TableCell>
                <TableCell>Método Pago</TableCell>
                <TableCell>Fecha Pago</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {editFormData.proveedorCompraPagoUpdates.map((pago, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      margin="dense"
                      label="Monto Pagado"
                      value={pago.montoPagado}
                      onChange={(e) =>
                        handleEditPaymentChange(
                          index,
                          "montoPagado",
                          e.target.value
                        )
                      }
                      fullWidth
                      onKeyDown={handleNumericKeyDown}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pago.metodoPago}
                      onChange={(e) =>
                        handleEditPaymentChange(
                          index,
                          "metodoPago",
                          e.target.value
                        )
                      }
                      fullWidth
                    >
                      <MenuItem value="EFECTIVO">EFECTIVO</MenuItem>
                      <MenuItem value="TRANSFERENCIA">TRANSFERENCIA</MenuItem>
                      <MenuItem value="CHEQUE">CHEQUE</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha Pago"
                        value={pago.fechaPago ? dayjs(pago.fechaPago) : null}
                        onChange={(newValue) =>
                          handleEditPaymentChange(
                            index,
                            "fechaPago",
                            newValue
                          )
                        }
                        renderInput={(params) => (
                          <TextField {...params} margin="dense" fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleEdit} color="secondary" variant="contained">
          EDITAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
