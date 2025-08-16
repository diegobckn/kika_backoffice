import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function LevelRow({
  row,
  index,
  editable,
  handleEditRow,
  handleSaveRow,
  handleDeleteRow,
  handleInputChange,
}) {
  const handleKeyDown = (e) => {
    if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };
  return (
    <TableRow key={index}>
      <TableCell align="center" contentEditable={editable}>
        <TextField
          type="text"
          name="desde"
          value={row.desde}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleInputChange(e, index)}
          size="small"
          disabled={!editable}
          inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos

        />
      </TableCell>
      <TableCell align="center" contentEditable={editable}>
        <TextField
          type="text"
          name="hasta"
          value={row.hasta}
          onChange={(e) => handleInputChange(e, index)}
          size="small"
          disabled={!editable}
          inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos

        />
      </TableCell>
      <TableCell align="center" contentEditable={editable}>
        <TextField
          type="text"
          name="valor"
          value={row.valor}
          onChange={(e) => handleInputChange(e, index)}
          size="small"
          disabled={!editable}
          inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos

        />
      </TableCell>
      <TableCell align="center" sx={{ padding: '6px', minWidth: 20 }}>
        {editable ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ minWidth: 20, padding: '5px' }} // Ajuste del espaciado interno
            onClick={() => handleSaveRow(index)}
          >
            <CheckCircleIcon />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            size="small"
            sx={{ minWidth: 20, padding: '5px' }} // Ajuste del espaciado interno
            onClick={() => handleEditRow(index)}
          >
            <AddCircleIcon />
          </Button>
        )}
      </TableCell>
      <TableCell align="center" sx={{ padding: '6px', minWidth: 20 }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          sx={{ minWidth: 20, padding: '5px' }} // Ajuste del espaciado interno
          onClick={() => handleDeleteRow(index)}
        >
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}




function TablaNivel() {
  const [tableData, setTableData] = useState([]);
  const [newRow, setNewRow] = useState({ desde: "", hasta: "", valor: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editableRow, setEditableRow] = useState(null);

  const handleEditRow = (index) => {
    setEditableRow(index);
  };

  const handleSaveRow = (index) => {
    setEditableRow(null);
  };

  const handleDeleteRow = (index) => {
    setTableData(tableData.filter((row, i) => i !== index));
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newData = [...tableData];
    newData[index][name] = value;
    setTableData(newData);
  };

  const handleAddRow = () => {
    if (
      newRow.desde.trim() === "" ||
      newRow.hasta.trim() === "" ||
      newRow.valor.trim() === ""
    ) {
      setErrorMessage("Todos los campos son requeridos.");
      return;
    }
  
    if (parseInt(newRow.valor) === 0) {
      setErrorMessage("El valor no puede ser igual a cero.");
      return;
    }
  
    const lastRow = tableData[tableData.length - 1];
    const newRowDesde = parseInt(newRow.desde);
    const lastRowHasta = parseInt(lastRow ? lastRow.hasta : 0); // Si no hay filas, comenzamos desde 0
    if (newRowDesde <= lastRowHasta) {
      setErrorMessage("El valor 'desde' debe ser mayor que el último valor 'hasta' ingresado.");
      return;
    }
  
    if (parseInt(newRow.hasta) <= newRowDesde) {
      setErrorMessage("El valor 'hasta' debe ser mayor que el valor 'desde'.");
      return;
    }
  
    setTableData([...tableData, newRow]);
    setNewRow({ desde: "", hasta: "", valor: "" });
    setErrorMessage("");
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6} md={12}>
        <TableContainer component={Paper} sx={{ marginRight: "4px" }}>
          <Grid container justifyContent="center">
            <h5>Precios por Unidad o kg</h5>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </Grid>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Desde</TableCell>
                <TableCell>Hasta</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <LevelRow
                  key={index}
                  row={row}
                  index={index}
                  editable={index === editableRow}
                  handleEditRow={handleEditRow}
                  handleSaveRow={handleSaveRow}
                  handleDeleteRow={handleDeleteRow}
                  handleInputChange={handleInputChange}
                />
              ))}
              <TableRow>
                <TableCell align="center">
                  <TextField
                    sx={{ width: 65 }}
                    type="text"
                    name="desde"
                    value={newRow.desde}
                    onKeyDown={handleKeyDown}
                    onChange={(e) =>
                      setNewRow({ ...newRow, desde: e.target.value })
                    }
                    size="small"
                    inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    sx={{ width: 65 }}
                    type="text"
                    name="hasta"
                    value={newRow.hasta}
                    onKeyDown={handleKeyDown}
                    onChange={(e) =>
                      setNewRow({ ...newRow, hasta: e.target.value })
                    }
                    size="small"
                    inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    sx={{ width: 77 }}
                    type="text"
                    name="valor"
                    value={newRow.valor}
                    onKeyDown={handleKeyDown}
                    onChange={(e) =>
                      setNewRow({ ...newRow, valor: e.target.value })
                    }
                    size="small"
                    inputProps={{ maxLength: 6 }} // Limitar a 6 dígitos
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddRow}
                  >
                    Crear
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="El valor debe ser mayor que el último valor ingresado"
      />
    </Grid>
  );
}
export default TablaNivel;
