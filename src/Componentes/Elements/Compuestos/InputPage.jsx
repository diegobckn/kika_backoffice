import React, { useState, useContext, useEffect } from "react";
import { TextField, InputLabel } from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import Validator from "../../../Helpers/Validator";

const InputPage = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "page",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  maxLength = 255,
  canAutoComplete = false,
  required = false,
  vars = null
}) => {
  const { showMessage } = useContext(SelectedOptionsContext);

  const [page, setPage] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const [validation, setValidation] = validationState ? validationState : vars ? vars[1][fieldName] : useState(null)

  const [keyPressed, setKeyPressed] = useState(false);

  const validate = () => {
    const formatOk = Validator.isUrl(page);
    const len = page.length;
    const reqOk = (!required || (required && len > 0));
    var badMinlength = false;
    var badMaxlength = false;

    if (minLength && len < minLength) {
      badMinlength = true;
    }

    if (maxLength && len > maxLength) {
      badMaxlength = true;
    }

    var message = "";
    if (!reqOk) {
      message = fieldName + ": es requerido.";
    } else if (badMinlength) {
      message = fieldName + ": debe tener " + minLength + " caracteres o más.";
    } else if (badMaxlength) {
      message = fieldName + ": debe tener " + maxLength + " caracteres o menos.";
    } else if (!formatOk) {
      message = fieldName + ": El formato de la URL es incorrecto.";
    }

    const validationObj = {
      badMinlength: badMinlength,
      badMaxlength: badMaxlength,
      require: !reqOk,
      empty: len === 0,
      format: formatOk,
      allOk: (reqOk && !badMinlength && !badMaxlength),
      message: message,
    };
    setValidation(validationObj);
  };

  const checkKeyDown = (event) => {
    if (!canAutoComplete && event.key === "Unidentified") {
      event.preventDefault();
      return false;
    } else {
      setKeyPressed(true);
    }
    return true;
  };

  const checkChange = (event) => {
    if (!canAutoComplete && !keyPressed) {
      return;
    }
    setPage(event.target.value);
  };

  const checkChangeBlur = () => {
    validate();
  };

  useEffect(() => {
    validate();
  }, []); // Runs on mount

  useEffect(() => {
    validate();
  }, [page]); // Runs when `page` changes

  return (
    <>
      {withLabel && (
        <InputLabel sx={{ marginBottom: "2%" }}>
          {label}
        </InputLabel>
      )}
      <TextField
        fullWidth
        autoFocus={autoFocus}
        margin="normal"
        required={required}
        type="url"
        label={label}
        value={page}
        onChange={checkChange}
        onBlur={checkChangeBlur}
        onKeyDown={checkKeyDown}
      />
    </>
  );
};

export default InputPage;
