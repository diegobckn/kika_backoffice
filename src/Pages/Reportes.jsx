import React from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SideBar from "../Componentes/NavBar/SideBar";

const Reportes = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      title: "Cuentas Corrientes Clientes",
      path: "/reportes/cuentacorrienteclientes",
    },
    {
      title: "Cuentas Corrientes Proveedores",
      path: "/reportes/cuentacorrienteproveedores",
    },
    {
      title: "Ranking de Venta",
      path: "/reportes/rankingventas",
    },
    {
      title: "Ranking de Venta de Productos",
      path: "/reportes/rankingproductos",
    },
    {
      title: "Libro Ventas",
      path: "/reportes/rankinglibroventas",
    },
    {
      title: "Libro Compras",
      path: "/reportes/rankinglibrocompras",
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <Grid component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ mb: 4, textAlign: "center" }}
        >
          Reportes
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {reportCards.map((report, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <TableContainer component={Paper} sx={{ p: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: "gainsboro",
                        }}
                      >
                        {report.title}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={() => navigate(report.path)}
                          sx={{ mt: 2 }}
                        >
                          Ir a reportes
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Reportes;
