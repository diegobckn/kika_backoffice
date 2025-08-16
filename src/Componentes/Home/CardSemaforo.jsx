/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import Model from '../../Models/Model';
import dayjs from 'dayjs';
import RefreshInfoControl from '../Elements/RefreshInfoControl';

export default function({
}) {

  const INTERVAL = 5 * 60 * 1000

  const [estado, setEstado] = useState(null)
  const [intControl, setIntControl] = useState(null)
  const [ultimoCheck, setultimoCheck] = useState("")


  const fetchData = async () => 
  {
    return Model.getConexion(()=>{
      setEstado(1)
      setultimoCheck(dayjs().format("HH:mm") + "hs")
    },(err)=>{
      setEstado(0)
      setultimoCheck(dayjs().format("HH:mm") + "hs")
    })
  };

  useEffect(()=>{
    fetchData()
    if(intControl === null){
      setIntControl(setInterval(() => {
        fetchData()
      }, INTERVAL))
    }
  },[])

  return (
    <Card>
        <CardContent sx={{
        position: "relative"
      }}>

        <RefreshInfoControl
          variableEnSesion={"dashboardRefreshConexion"}
          fetchInfo={fetchData}
        />
          <Typography variant="body-md">Conexion</Typography>
          {estado !== null &&(
          <Typography variant="p"
            sx={{
              padding:"10px",
              margin:"10px",
              backgroundColor:( estado ? "#01E401" : "#FF0033"),
              color:"#fff",
              borderRadius:"5px"
            }}
            >{ estado ? "CONECTADO": "SIN CONEXION" } 
            <Typography sx={{
              margin:"0 10px"
            }}
            variant='span'>
            {ultimoCheck}
            </Typography>
          </Typography>
          )}
        </CardContent>
    </Card> 
  );
}