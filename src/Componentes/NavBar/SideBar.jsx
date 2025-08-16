import React, { useState, useContext, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importar el icono
import ExpandMore from "@mui/icons-material/ExpandMore";
import PolylineIcon from '@mui/icons-material/Polyline';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Button, IconButton, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import CONSTANTS from "../../definitions/Constants";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import CloseSession from '../ScreenDialog/CloseSession'
import AddCardIcon from '@mui/icons-material/AddCard';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
const drawerWidth = 240;


export default function PermanentDrawerLeft() {

  const { GeneralElements } = useContext(SelectedOptionsContext);


  const [openSubMenu, setOpenSubMenu] = useState({});
  const [showScreenConfig, setShowScreenConfig] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [subCurrentUrl, setSubCurrentUrl] = useState("");

  const [openSessionDialog, setOpenSessionDialog] = useState(false);

  const handleSubMenuClick = (text) => {
    setOpenSubMenu((prevOpenSubMenu) => ({
      ...prevOpenSubMenu,
      [text]: !prevOpenSubMenu[text],
    }));
  };

  useEffect(()=>{
    if(currentUrl == ""){
      var urlArr = window.location.href.split("/")
      if( urlArr.length > 4 ){
        setSubCurrentUrl("/" + urlArr[4] )
      }
      urlArr.splice(0,3)
      setCurrentUrl("/" + urlArr[0])
    }


    if(menuItems.length == 0){
      var menuItemsBase = [
        { text: "Home", link: "/", icon: <HomeIcon /> },
        { text: "Sucursales", link: "/sucursales", icon: <WarehouseIcon />,
          subMenuItems: [
            { text: "Caja", link: "/sucursales/cajasucursal", icon: <PointOfSaleIcon /> },
            { text: "Preventa", link: "/sucursales/preventa", icon: <RequestQuoteIcon /> },
            // { text: "Método Impresión", link: "/sucursales/metodoimpresion", icon: <ReceiptLongIcon /> },
            // { text: "Pasarela de Pago", link: "/sucursales/pasarelapago", icon: <AddCardIcon/> },
          ], 
        }
        ,
        { text: "Usuarios", link: "/usuarios", icon: <PeopleAltIcon /> },
        { text: "Precios", link: "/precios", icon: <PriceChangeIcon /> },
        {
          text: "Proveedores",
          link: "/proveedores",
          icon: <LocalShippingIcon />,
          subMenuItems: [
            { text: "Ingreso Documento", link: "/proveedores/ingresodocumento", icon: <ReceiptIcon /> },
            { text: "Documentos por pagar ", link: "/proveedores/documentosporpagar", icon: <ReceiptIcon /> },
          ],
        },
        { text: "Clientes", link: "/clientes", icon: <GroupsIcon/>, subMenuItems: [
          
          { text: "Documentos por cobrar", link: "/clientes/reportes", icon: <ReceiptIcon /> },
        ], },
        
        {
          text: "Productos",
          link: "/productos",
          icon: <CategoryIcon />,
          subMenuItems: [
            { text: "Categorias", link: "/productos/categorias",icon: <CategoryIcon />},
            { text: "Sub-Categorias", link: "/productos/subcategorias",icon: <PolylineIcon /> },
            { text: "Familia", link: "/productos/familias",icon:<StackedBarChartIcon/> },
            { text: "Sub-Familia", link: "/productos/subfamilias",icon:<SchemaOutlinedIcon/> },
            // Add more sub-menu items as needed
          ],
        },
        {
          text: "Stock",
          link: "/stock",
          icon: <ListAltIcon />,
          // subMenuItems: [
          //   { text: "Entrada y Salida de Stock ", link: "/stock/entradasalidastock",icon: <ImportExportIcon/>},
          // ]
          
        },

 
        {
          text: "Reportes",
          link: "/reportes",

          icon: <FactCheckIcon />,
          subMenuItems: [
            { text: "Maestro de productos", link: "/reportes/maestro-productos",icon: <SummarizeIcon />},
            { text: "Cuentas corrientes clientes", link: "/reportes/cuentacorrienteclientes",icon: <SummarizeIcon />},
            { text: "Cuentas corrientes proveedores", link: "/reportes/cuentacorrienteproveedores",icon: <SummarizeIcon />},
            { text: "Ranking de Venta por forma de pago", link: "/reportes/rankingventas",icon: <SummarizeIcon />},
            { text: "Ranking de Venta de Productos", link: "/reportes/rankingproductos",icon: <SummarizeIcon />},
            { text: "Reporte stock critico", link: "/reportes/stockcriticos",icon: <SummarizeIcon style={{color:"red"}}  />},
            { text: "Reporte stock valorizado", link: "/reportes/reportestockvalorizado",icon: <SummarizeIcon style={{color:"springgreen"}}  />},
            { text: "Reporte costos ganancias", link: "/reportes/costosganancias",icon: <SummarizeIcon />},
            { text: "Libro de Ventas", link: "/reportes/rankinglibroventas",icon: <SummarizeIcon />},
            { text: "Libro de Compras", link: "/reportes/rankinglibrocompras",icon: <SummarizeIcon />},
            // { text: "Reporte Z", link: "/reportes/reportez",icon: <SummarizeIcon />},
            { text: "Reporte Cierre Z", link: "/reportes/reportecierrez",icon: <SummarizeIcon />},
            { text: "Preventas", link: "/reportes/preventas",icon: <SummarizeIcon />},

          ],
        },
        {
          text: "Config",
          link: "#",
          
          icon: <Settings />,
          action: ()=>{
            setShowScreenConfig(true)
          }
        },
      ];
      setMenuItems(menuItemsBase)
    }

    

  },[])

  useEffect(()=>{
    // console.log("cambio items")
    menuItems.forEach((itemx,ix)=>{
      if(itemx.link == currentUrl){
        handleSubMenuClick(itemx.text)
      }
    })

  },[menuItems])


  return (
    <Box sx={{ 
      display: "flex",
      position:"relative"
      }}>
      <CssBaseline />
      <GeneralElements/>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
           
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {currentUrl != "" && menuItems.length>0 && menuItems.map((item) => {
            return(
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <Link
                  onClick={()=>{
                    {item.action && (
                      item.action()
                    )}
                  }}
                  to={item.link}
                  style={{ 
                    textDecoration: "none", 
                    width:"100%",
                    backgroundColor:(currentUrl == item.link ? "#4d4d4d" : "transparent"),
                    color:(currentUrl == item.link ? "whitesmoke" : "black")
                  }}
                >
                  <ListItemButton onClick={() => handleSubMenuClick(item.text)}>
                    <ListItemIcon style={{
                      backgroundColor:(currentUrl == item.link ? "#4d4d4d" : "transparent"),
                      color:(currentUrl == item.link ? "whitesmoke" : "black")
                    }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.subMenuItems ? (
                      openSubMenu[item.text] ? <ExpandLess /> : <ExpandMore />
                    ) : null}
                  </ListItemButton>
                </Link>
              </ListItem>
              {item.subMenuItems && openSubMenu[item.text] && (
                <List component="div" disablePadding>
                  {item.subMenuItems.map((subItem) => {
                    return(
                    <ListItem key={subItem.text} disablePadding>
                      <Link
                        to={subItem.link}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width:"100%",
                          backgroundColor:(currentUrl + subCurrentUrl == subItem.link ? "#A0A0A0" : "transparent"),
                          color: "black"
                        }}
                        >

                        <ListItemButton>
                          <ListItemIcon />
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  )
                }
                )
                }
                </List>
              )}
            </React.Fragment>
          )}
        )}

        </List>
        <CloseSession openDialog={openSessionDialog} setOpenDialog={setOpenSessionDialog}/>
        <Typography sx={{
          margin:"0 20px"
        }}>{CONSTANTS.appName + " - " + CONSTANTS.appVersion}</Typography>
      
      <div style={{
            width: "100%",
            position: "relative",
            left: "0",
            bottom: "0",
            margin: "30px 0 0 0",
            padding: "10px"
      }}>
        <Button
          variant="outlined"
          color="error"
          onClick={()=>{
            console.log("apreta logout")
            setOpenSessionDialog(true)
          }}
          startIcon={<ExitToAppIcon />}
          style={{
          }}
          >
          Cerrar Sesión
        </Button>
        </div>

      </Drawer>
      <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={setShowScreenConfig} />

    </Box>
  );
}
