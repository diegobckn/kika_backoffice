import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Settings, Visibility, VisibilityOff } from "@mui/icons-material";
import ModelConfig from "./../../Models/ModelConfig";
import dayjs from "dayjs";
import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import System from "./../../Helpers/System";
import User from "./../../Models/User";
import { SelectedOptionsContext } from "./../Context/SelectedOptionsProvider";
import CardSemaforo from "../Home/CardSemaforo";

export default ({
  openDialog,
  setOpenDialog,
  onSuccess,
  showBackButton = true
}) => {

  const {
    showLoading,
    hideLoading,
    showAlert,
    showMessage
  } = useContext(SelectedOptionsContext);


  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScreenConfig, setShowScreenConfig] = useState(false);

  const [footerTextSupport, setFooterTextSupport] = useState("Version 1.0.0");

  useEffect(() => {
    var dateTimeNow = dayjs().format('DD/MM/YYYY - HH:mm:ss')
    setFooterTextSupport(System.getInstance().getAppName() + " - " + dateTimeNow)
  }, [])


  useEffect(() => {
    ModelConfig.getInstance().getFirst()
  }, [])

  const handleLogin = async () => {
    if (!rutOrCode || !password) {
      setError("Por favor, completa ambos campos.");
      return;
    }
    setLoading(true);

    const data = {
      codigoUsuario: 0,
      rut: "",
      clave: password,
    }

    if (rutOrCode.indexOf("-") > -1) {
      data.rut = rutOrCode
    } else {
      data.codigoUsuario = parseInt(rutOrCode)
    }

    User.doLoginServer(data, (responseData, response) => {
      const userOk = responseData.responseUsuario
      onSuccess(userOk)
      setLoading(false);
      setOpenDialog(false)
    }, (err) => {
      setError(err)
      setLoading(false);
    })
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
      }}
      fullScreen
      maxWidth="lg"
    >
      <DialogTitle>
      </DialogTitle>
      <DialogContent>

        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            {error && (
              <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
            )}
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Código o Rut"
                autoFocus
                value={rutOrCode}
                onChange={(e) => setRutOrCode(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Clave"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />


              <Grid item xs={12} sm={12} md={12} lg={12} sx={{
                marginTop: "50px",
                border: "1px solid #ccc"
              }}>
                <CardSemaforo />
              </Grid>




              <Typography component="h4" style={{
                position: "fixed",
                bottom: 0
              }}>
                <p>
                  {footerTextSupport}
                  <IconButton
                    onClick={() => { setShowScreenConfig(true) }}
                    edge="end"
                  >
                    <Settings />
                  </IconButton>
                </p>

              </Typography>

              <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={setShowScreenConfig} />

              <Button
                sx={{
                  width: "90%",
                  margin: "30px 5%"
                }}
                variant="contained"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress
                      color="inherit"
                      size={20}
                      sx={{ marginRight: 1 }}
                    />
                    Ingresando
                  </Box>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>

              {showBackButton && (
                <Button
                  sx={{
                    width: "90%",
                    margin: "30px 5%"
                  }}
                  onClick={() => { setOpenDialog(false) }}
                >
                  Volver
                </Button>
              )}
            </Box>
          </Box>
        </Container>







      </DialogContent>
    </Dialog>






  );
};

