import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

const BoxSelectTipo = ({ 
  tipoElegido,
  setTipoElegido,
}) => {
  return (
          <table>
            <tbody>
            <tr>
                <td><Button
                sx={{
                  height: "60px",
                  backgroundColor:( tipoElegido == 0 ? "#c9c9c9" : ""),
                  color:( tipoElegido == 0 ? "black" : ""),
                  borderColor:( tipoElegido == 0 ? "black" : ""),
                  "&:hover":{
                    borderColor: "black",
                    backgroundColor: "#c9c9c9",
                    color:"black",
                  }
                }}
                variant={tipoElegido === 1 ? "outlined" : "outlined"}

                fullWidth
                onClick={() => {setTipoElegido(0)}}
                >
                Cod prov.
              </Button></td>

              <td>
              <Button
                sx={{
                  height: "60px",
                  backgroundColor:( tipoElegido == 1 ? "#c9c9c9" : ""),
                  borderColor:( tipoElegido == 1 ? "black" : ""),
                  color:( tipoElegido == 1 ? "black" : ""),
                  "&:hover":{
                    borderColor: "black",
                    backgroundColor: "#c9c9c9",
                    color:"black",
                  }
                }}
                variant={tipoElegido === 1 ? "outlined" : "outlined"}
                onClick={() => {setTipoElegido(1)}}
                fullWidth
              >
                Desc Prov
              </Button>
              </td>

              <td>
              <Button
                sx={{
                  height: "60px",
                  backgroundColor:( tipoElegido == 2 ? "#c9c9c9" : ""),
                  color:( tipoElegido == 2 ? "black" : ""),
                  borderColor:( tipoElegido == 2 ? "black" : ""),
                  "&:hover":{
                    borderColor: "black",
                    backgroundColor: "#c9c9c9",
                    color:"black",
                  }
                }}
                variant={tipoElegido === 2 ? "outlined" : "outlined"}
                onClick={() => {setTipoElegido(2)}}
                fullWidth
              >
                Cod Barras
              </Button>
              </td>

              <td>
              <Button
                sx={{
                  height: "60px",
                  backgroundColor:( tipoElegido == 3 ? "#c9c9c9" : ""),
                  color:( tipoElegido == 3 ? "black" : ""),
                  borderColor:( tipoElegido == 3 ? "black" : ""),
                  "&:hover":{
                    borderColor: "black",
                    backgroundColor: "#c9c9c9",
                    color:"black",
                  }
                }}
                variant={tipoElegido === 3 ? "outlined" : "outlined"}
                onClick={() => {setTipoElegido(3)}}
                fullWidth
              >
                Descripcion
              </Button>
              </td>
              
            </tr>
            </tbody>
          </table>
  );
};

export default BoxSelectTipo;
