import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

// OptionType {
//   id:String,
//   value:String
// }

const BoxOptionList = ({ 
  optionSelected,
  setOptionSelected,
  options = []
}) => {
  return (
          <table>
            <tbody>
            <tr>

              {options.map((option,ix)=>{
                // console.log("map de options")
                // console.log("option", option)
                // console.log("optionSelected", optionSelected)
                // console.log("coincide con el select?",(optionSelected === option.id ? "si" : "no"))
                return(
                  <td key={ix} ><Button
                  id={`${ix}-btn`}
                  sx={{ height: "60px" }}
                  fullWidth
                  variant={optionSelected == option.id ? "contained" : "outlined"}
                  onClick={() => setOptionSelected(option.id)}
                  >
                {option.value}
              </Button></td>
              )
            })}

              
            </tr>
            </tbody>
          </table>
  );
};

export default BoxOptionList;
