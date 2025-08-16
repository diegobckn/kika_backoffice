import React, { useState, useContext, useEffect, useRef } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Button,
  Typography,
  Tooltip
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Backup, ChangeCircle, Check, Close, CloudDone, Dangerous, Task } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputFile = ({
  inputState,
  validationState,
  withLabel = true,
  fieldName = "name",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  required = false,
  extensions = "png,jpg",
  fileInputLabel = "Elegir " + label,
  vars = null
}) => {

  const {
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const prepareAcceptInput = () => {
    // console.log("prepareAcceptInput")
    var accept = ""

    const traduceType = (extension) => {
      var oth = extension
      switch (extension) {
        case "png":
          // oth = "image/png"
          oth = ".png"
          break;
        case "jpg":
        case "jpeg":
          oth = "image/jpeg"
          break;
        case "pdf":
          oth = "application/pdf"
          break;
      }


      return oth
    }

    extensions.split(",").forEach((extension) => {
      if (accept != "") accept += ","
      accept += traduceType(extension)
    })

    console.log("prepareAcceptInput devuelve:", accept)
    setAccepts(accept)
  }

  const [fileValue, setFileValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [fileName, setFileName] = useState("")

  const refInputFile = useRef(null)
  const [accepts, setAccepts] = useState("")


  const validate = () => {
    // console.log("validate de:" + fieldName)
    const len = fileName.length
    // console.log("len:", len)
    const reqOk = (!required || (required && len > 0))

    var message = ""
    if (!reqOk) {
      message = fieldName + ": es requerido."
    }

    const vl = {
      "require": !reqOk,
      "empty": len == 0,
      "allOk": (reqOk), // && !badMinlength && !badMaxlength),
      "message": message
    }
    // console.log("validacion vale:", vl)
    setValidation(vl)
  }

  const checkChange = (event) => {
    const value = event.target.value
    // console.log("cambio valor", value)
    if (value != "") {
      if (Validator.isFile(value, extensions)) {
        // console.log(value + " es valido")
        setFileName(value);
        setFileValue(refInputFile ? refInputFile.current.querySelector("input").files[0] : null)
        // onAssign(refInputFile ? refInputFile.current.querySelector("input").files[0] : null)
      } else {
        // console.log("es incorrecta")
        setFileName("");
        showMessage("Archivo incorrecto")
        setFileValue(null)
      }
    }

  }

  const formatFileName = (event) => {
    var fnB = []
    if (fileName.indexOf("/") > -1) {
      fnB = fileName.split("/")
    } else {
      fnB = fileName.split("\\")
    }
    var fn = fnB[fnB.length - 1]
    return fn.substr(0, 10)
  }

  useEffect(() => {
    // console.log("cambio inputState")
    // console.log(inputState)
    validate()
  }, [fileName])


  useEffect(() => {
    prepareAcceptInput()
  }, [])

  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}

      <div style={{
        backgroundColor: "#f0f0f0",
        marginTop: "25px",
        border: "1px solid #989898",
        height: "56px",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        marginTop: "25px"
      }}>

        <TextField
          ref={refInputFile}
          sx={{
            display: "none"
          }}
          fullWidth
          // accept = {extensions}
          accept={accepts}
          // autoFocus={autoFocus}
          margin="normal"
          required={required}
          type="file"
          // label={label}
          onChange={checkChange}
        />




        {fileName === "" ? (


          <Button sx={{
            border: "1px solid rgb(184 187 189)",
            backgroundColor: "#e7fffd",
            marginLeft: "4px",
            color: "#3d3c3c",
            // marginTop:"25px",
            "&:hover": {
              color: "#fff",
              backgroundColor: "#3d3c3c",
            }
          }}

            onClick={() => {
              refInputFile.current.querySelector("input").click()
            }}
          >
            <Backup sx={{
              color: "#06AD16",
              marginRight: "10px"
            }} />
            {fileInputLabel}
          </Button>

        )


          :


          (
            <div>

              <Tooltip title={fileName}>
                <div style={{
                  display: "inline-block",
                  marginRight: "10px",
                  marginLeft: "4px",
                  padding: "10px",
                  cursor: "default",
                  border: "1px solid #cbcbcb"
                  // backgroundColor:"red"
                }}>
                  <Check sx={{
                    display: "inline-block",
                    color: "#06AD16",
                    marginRight: "10px"
                  }} />


                  <Typography sx={{
                    display: "inline-block"
                  }}>{formatFileName()}</Typography>

                </div>
              </Tooltip>

              <Button sx={{
                border: "1px solid rgb(184 187 189)",
                backgroundColor: "#e7fffd",
                color: "#3d3c3c",
                // marginTop:"25px",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#3d3c3c",
                }
              }}

                onClick={() => {
                  refInputFile.current.querySelector("input").click()
                }}
              >


                <ChangeCircle sx={{
                  color: "#3F08D7",
                  marginRight: "10px"
                }} />
                Cambiar
              </Button>

              <Button sx={{
                border: "1px solid rgb(184 187 189)",
                backgroundColor: "#e7fffd",
                marginLeft: "10px",
                color: "#3d3c3c",
                // marginTop:"25px",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "#3d3c3c",
                }
              }}

                onClick={() => {
                  showConfirm("Quitar?", () => {
                    setFileName("")
                    setFileValue(null)
                  })
                }}
              >


                <Close sx={{
                  color: "red",

                }} />
                Quitar
              </Button>
            </div>
          )}

      </div>
    </>
  );
};

export default InputFile;
