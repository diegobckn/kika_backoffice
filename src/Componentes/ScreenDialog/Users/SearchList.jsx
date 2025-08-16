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
import SideBar from "../../NavBar/SideBar"
import ModelConfig from "../../../Models/ModelConfig";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import User from "../../../Models/User";
import SearchListItem from "./SearchListItem";
import InputName from "../../Elements/Compuestos/InputName";

const SearchList = ({
  refresh = false
}) => {

  const {
    userData,
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [modalEditOpen, setModalOpen] = useState(false);
  const [doRefresh, setDoRefresh] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const perPage = 15;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialogAutorizacion, setOpenDialogAutorizacion] = useState(false)

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const apiUrl = ModelConfig.get().urlBase;

  const [verAutorizacion, setVerAutorizacion] = useState(false)
  const [qrAutorizacion, setQrAutorizacion] = useState("")

  // Filter users based on search term

  // Pagination
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;


  const [filteredUsers, setfilteredUsers] = useState([]);
  const [paginatedUsers, setpaginatedUsers] = useState([]);
  const [totalPages, settotalPages] = useState(0);


  const fetchUsers = async () => {
    // console.log("fetchUsers")
    User.getAll((usuarios) => {
      setUsers(usuarios)
      filtrarUsuarios(usuarios)
    }, showMessage)
  };

  useEffect(() => {
    console.log("cambio doRefresh", doRefresh)
    fetchUsers();
  }, [doRefresh]);

  // useEffect(() => {
  //   console.log("carga inicial")
  //   fetchUsers()
  // }, []);

  // useEffect(() => {
  // console.log("cambio users", users)
  // filtrarUsuarios()
  // }, [ [...users] ])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    // console.log("handleSearch", event)
    if (
      event.nativeEvent.inputType != 'insertText'
      && event.nativeEvent.inputType != 'deleteContentBackward'
    ) return
    setSearchTerm(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const filtrarUsuarios = (usersList) => {
    // console.log("filtrarUsuarios users esta asi", usersList)
    const filteredUsersx = usersList.filter((useritem) =>
      useritem.nombres.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // console.log("filteredUsers queda asi", filteredUsersx)
    setfilteredUsers(filteredUsersx)
    const paginatedUsersx = filteredUsersx.slice(startIndex, endIndex);
    setpaginatedUsers(paginatedUsersx)

    // console.log("paginatedUsers queda asi", paginatedUsers)
    const totalPagesx = Math.ceil(filteredUsersx.length / perPage);
    settotalPages(totalPagesx)
    // console.log("totalPages queda asi", totalPagesx)
  }


  useEffect(() => {
    setDoRefresh(refresh)
  }, [refresh])

  useEffect(() => {
    // console.log("cambio searchTerm o users")
    // console.log("cambio searchTerm", searchTerm)
    // console.log("cambio users", users)
    filtrarUsuarios(users)
  }, [searchTerm])
  // }, [searchTerm, [...users]])



  return (
    <Box sx={{ p: 2, mb: 4, border: "4px" }}>
      <SideBar />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={16000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}

        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Cerrar
          </Button>
        }
      />

      <TextField placeholder="Buscar..." value={searchTerm} onChange={handleSearch} />

      <Table sx={{ border: "1px ", borderRadius: "8px" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>RUT</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Crédito</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No se encontraron usuarios</TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user, ix) => (
              <SearchListItem
                user={user}
                key={ix}
                onNeedRefresh={() => {
                  setDoRefresh(!doRefresh)
                }}
              />))
          )}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >

        <Typography variant="body2">
          Página {currentPage} de {totalPages}
        </Typography>
        <Box>
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </Box>

      </Box>

    </Box>
  );
};

export default SearchList;
