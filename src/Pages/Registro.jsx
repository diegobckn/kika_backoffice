/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { InputAdornment } from '@mui/material';
import { Tooltip } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navigate, useNavigate} from 'react-router-dom';
import Swal from "sweetalert2";
import { CheckCircle } from '@mui/icons-material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Derechos  © '}
      <Link color="inherit" href="/">
       Easy POS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Registro() {
  const[nombre,setNombre]= useState('')
  const[apellido,setApellido]= useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const Navigate = useNavigate();



  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    //Validaciones
    if (!nombre) {
      errors.nombre = "Favor completar campo ";
    }
    if (!apellido) {
      errors.apellido = "Favor completar campo ";
    }
    if (!email) {
      errors.email = "Favor completar campo ";
    }else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)){
      errors.email = "Formato de email no es válido"

    }
    if (!password) {
      errors.password = "Favor completar campo ";
    }
    if (!password2) {
      errors.password2 = "Favor completar campo ";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const user = {

        nombre,
        apellido,
        email,
        password,
        password2,

      }
      console.log(user);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/registro",user
        )
        console.log(response.data.descripcion,'debugMiltoco')

        Swal.fire({
          icon: 'success',
          title: 'Todo en orden',
          text: (response.data.descripcion)
          
        })

        
      } catch (error) {
        console.log(error.response.data, "Leer Error");
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          text:(error.response.data.descripcion),
          title: (error.response.data.descripcion),
          
          
        })
        
      }
    }
    
    
    



    

  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registro
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                
                  name="nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  value={nombre}
                  onChange={(e)=>setNombre(e.target.value)}
                  autoFocus
                  error={!!errors.nombre} //!!Vacio o falso
                  helperText={errors.nombre}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {nombre &&
                        /^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/.test(
                          nombre
                        ) ? (
                          // eslint-disable-next-line react/jsx-no-undef
                          <Tooltip title="Correct rut format" placement="top">
                            <CheckCircle style={{ color: "green" }} />
                          </Tooltip>
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellido"
                  label="Apellido"
                  name="apellido"
                  value={apellido}
                  onChange={(e)=>setApellido(e.target.value)}
                  autoComplete="apellido"
                  error={!!errors.apellido} //!!Vacio o falso
                  helperText={errors.apellido}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {email &&
                        /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/.test(
                          email
                        ) ? (
                          <Tooltip title="Correct rut format" placement="top">
                            <CheckCircleIcon style={{ color: "green" }} />
                          </Tooltip>
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Ingrese Contraseña"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  autoComplete="new-password"
                  error={!!errors.password} //!!Vacio o falso
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!errors.password2} //!!Vacio o falso
                  helperText={errors.password2}
                  required
                  fullWidth
                  name="password2"
                  label="Repite Contraseña"
                  type="password"
                  id="password2"
                  value={password2}
                  onChange={(e)=>setPassword2(e.target.value)}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>  
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registrar
              </Button>
              <Grid container>
               
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Ya tienes cuenta?  Inicia sesión"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}