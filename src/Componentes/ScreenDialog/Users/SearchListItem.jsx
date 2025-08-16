import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import SideBar from "../../NavBar/SideBar"
import ModelConfig from "../../../Models/ModelConfig";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GenerarAutorizacion from "../GenerarAutorizacion";
import QrAutorizacion from "../QrAutorizacion";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import User from "../../../Models/User";
import UserFormDialog from "./UserFormDialog";

const SearchListItem = ({
  user,
  onNeedRefresh = () => { },
}) => {

  const {
    userData,
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [rolName, setRolName] = useState("")
  const [rolNum, setRolNum] = useState(0)

  const [showEdit, setShowEdit] = useState(false)
  const [showAutorizador, setShowAutorizador] = useState(false)
  const [showCrearAutorizador, setShowCrearAutorizador] = useState(false)
  const [qrAutorizacion, setQrAutorizacion] = useState("")

  const deleteUser = () => {
    showConfirm("Eliminar el usuario " + user.nombres + ' ' + user.apellidos + "?", () => {
      User.delete(user.codigoUsuario, () => {
        onNeedRefresh()
      }, showMessage)
    }, () => { })
  }



  const buscarRolId = async () => {
    User.intentarBuscarRolId(user.rol, (idRol) => {
      setRolNum(idRol)
    })
  }

  const getQrAutorizacion = async (code) => {
    showLoading("cargando imagen")
    const apiUrl = ModelConfig.get("urlBase")
    try {
      const response = await axios.get(
        apiUrl + `/Usuarios/CrearQRAutorizador?code=` + code);
      // console.log("API response:", response.data);
      if (response.data.autorizacion != "") {
        setQrAutorizacion(response.data.autorizacion);
        setShowAutorizador(true)
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("No se pudo cargar")
    } finally {
      hideLoading()
    }
  };

  const buscarRolName = async () => {
    setRolName(await User.findRolNameById(rolNum))
  }

  useEffect(() => {
    buscarRolId()
  }, [])

  useEffect(() => {
    if (rolNum > 0) {
      buscarRolName()
      user.RolId = rolNum
    }
  }, [rolNum])

  useEffect(() => {
    if (rolName != '') {
      user.RolName = rolName
    }
  }, [rolName])

  return (
    <TableRow key={user.codigoUsuario}>
      <TableCell>
        {user.codigoUsuario}
        {user.autorizacion && (
          <Button onClick={() => {
            getQrAutorizacion(user.autorizacion)
          }}>
            <HowToRegIcon />
          </Button>
        )}
      </TableCell>
      <TableCell>
        <span style={{ color: "purple" }}>{user.nombres}</span>
        <br />
        <span>{user.apellidos}</span>
        <br />
        <span>{user.correo}</span>
        <br />
        <span>Rol: {rolName}({user.rol})</span>
      </TableCell>
      <TableCell>{user.rut}</TableCell>
      <TableCell>
        {user.direccion}
        <br />
        {user.comuna}
        <br />
        {user.region}
      </TableCell>
      <TableCell>{user.telefono}</TableCell>
      <TableCell>{user.credito}</TableCell>
      <TableCell>
        {/* { (userData.rol === 1 || ( parseInt(userData.rol) <= parseInt(user.rol) )) && ( */}
        <>
          {/* <Button onClick={() => handleDeleteConfirmationOpen(user)}> */}
          <Button onClick={deleteUser}>
            <DeleteIcon />
          </Button>

          <Button onClick={() => {
            setShowEdit(true)
          }}>
            <EditIcon />
          </Button>

          <Button onClick={() => {
            // setTimeout(() => {
            setShowCrearAutorizador(true)
            // }, 2000);
          }}>
            <HowToRegIcon />
          </Button>
        </>
        {/* )} */}

        {/* {showEdit ? (
          <UserFormDialog
            // isEdit={true}
            // editInfo={user}
            openDialog={showEdit}
            setOpenDialog={setShowEdit}
            onSave={() => {
              onNeedRefresh()
            }}
          />
        ):null} */}

        {showEdit ? (
          <UserFormDialog
            isEdit={true}
            editInfo={user}
            openDialog={showEdit}
            setOpendialog={setShowEdit}
            onSave={() => {
              onNeedRefresh()
            }}
          />
        ) : (
          <></>
        )}



        {showAutorizador && (
          <QrAutorizacion
            openDialog={showAutorizador}
            setOpenDialog={setShowAutorizador}
            qrAutorizacion={qrAutorizacion}
          />
        )}

        {showCrearAutorizador && (
          <GenerarAutorizacion
            selectedUser={user}
            openDialog={showCrearAutorizador}
            setOpenDialog={setShowCrearAutorizador}
            onCreate={() => {
              onNeedRefresh()
            }}
          />
        )}

      </TableCell>
    </TableRow>


  );
};

export default SearchListItem;
