import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const TablaPrecios = () => {
  const [tableData, setTableData] = useState([
    { id: 1, detalle: "1", mayor1: "5", mayor2: "20,000", mayor3: "22" },
  ]);
  const [newRow, setNewRow] = useState({
    detalle: "",
    mayor1: "",
    mayor2: "",
    mayor3: "",
  });

  const handleAddRow = () => {
    const newId = tableData.length + 1;
    setTableData([...tableData, { id: newId, ...newRow }]);
    setNewRow({ detalle: "", mayor1: "", mayor2: "", mayor3: "" });
  };

  const handleDeleteRow = (id) => {
    setTableData(tableData.filter((row) => row.id !== id));
  };

  const handleInputChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={12}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Detalle</TableCell>
                <TableCell>Mayor 1</TableCell>
                <TableCell>Mayor 2</TableCell>
                <TableCell>Mayor 3</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>{row.detalle}</TableCell>
                  <TableCell>{row.mayor1}</TableCell>
                  <TableCell>{row.mayor2}</TableCell>
                  <TableCell>{row.mayor3}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleDeleteRow(row.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <TextField
                    type="text"
                    name="detalle"
                    value={newRow.detalle}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    name="mayor1"
                    value={newRow.mayor1}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    name="mayor2"
                    value={newRow.mayor2}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    name="mayor3"
                    value={newRow.mayor3}
                    onChange={handleInputChange}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<AddCircleIcon />}
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
    </Grid>
  );
};

export default TablaPrecios;
