import React, { useState, useContext, useEffect } from "react";
import TeclaButton from "./../Elements/TeclaButton"
import TeclaEnterButton from "./../Elements/TeclaEnterButton"
import TeclaBorrarButton from "./../Elements/TeclaBorrarButton"

const TecladoAlfaNumerico = ({showFlag,varValue, varChanger, onEnter}) => {

  const handleKeyButton = (key)=>{
     if(key == "enter"){
       onEnter()
       return
    }

    if(key == "borrar"){
      varChanger( varValue.slice(0, -1) )
       return
     }

    varChanger( varValue + key )
  }

  return (
    showFlag ? (
    <div style={{
      width: "740px",
      height: "300px",
      position: "fixed",
      zIndex: "10",
      background: "#efefef",
      display: "flex",
      alignContent: "center",
      alignItems: "start",
      flex: "1",
      left: "calc(50% - 370px)",
      bottom: "50px",
      flexDirection:"column"

    }}>
      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>

      <TeclaButton textButton="1" actionButton={handleKeyButton} />
      <TeclaButton textButton="2" actionButton={handleKeyButton} />
      <TeclaButton textButton="3" actionButton={handleKeyButton} />
      <TeclaButton textButton="4" actionButton={handleKeyButton} />
      <TeclaButton textButton="5" actionButton={handleKeyButton} />
      <TeclaButton textButton="6" actionButton={handleKeyButton} />
      <TeclaButton textButton="7" actionButton={handleKeyButton} />
      <TeclaButton textButton="8" actionButton={handleKeyButton} />
      <TeclaButton textButton="9" actionButton={handleKeyButton} />
      <TeclaButton textButton="0" actionButton={handleKeyButton} />
    </div>

    <div style={{
        display:"flex",
        flexDirection:"row"
      }}>

      <TeclaButton textButton="q" actionButton={handleKeyButton} />
      <TeclaButton textButton="w" actionButton={handleKeyButton} />
      <TeclaButton textButton="e" actionButton={handleKeyButton} />
      <TeclaButton textButton="r" actionButton={handleKeyButton} />
      <TeclaButton textButton="t" actionButton={handleKeyButton} />
      <TeclaButton textButton="y" actionButton={handleKeyButton} />
      <TeclaButton textButton="u" actionButton={handleKeyButton} />
      <TeclaButton textButton="i" actionButton={handleKeyButton} />
      <TeclaButton textButton="o" actionButton={handleKeyButton} />
      <TeclaButton textButton="p" actionButton={handleKeyButton} />
    </div>



      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>


      <TeclaButton textButton="a" actionButton={handleKeyButton} />
      <TeclaButton textButton="s" actionButton={handleKeyButton} />
      <TeclaButton textButton="d" actionButton={handleKeyButton} />
      <TeclaButton textButton="f" actionButton={handleKeyButton} />
      <TeclaButton textButton="g" actionButton={handleKeyButton} />
      <TeclaButton textButton="h" actionButton={handleKeyButton} />
      <TeclaButton textButton="j" actionButton={handleKeyButton} />
      <TeclaButton textButton="k" actionButton={handleKeyButton} />
      <TeclaButton textButton="l" actionButton={handleKeyButton} />
      <TeclaButton textButton="ñ" actionButton={handleKeyButton} />
      </div>


      <div style={{
        display:"flex",
        flexDirection:"row"
      }}>
      
      <TeclaButton textButton="z" actionButton={handleKeyButton} />
      <TeclaButton textButton="x" actionButton={handleKeyButton} />
      <TeclaButton textButton="c" actionButton={handleKeyButton} />
      <TeclaButton textButton="v" actionButton={handleKeyButton} />
      <TeclaButton textButton="b" actionButton={handleKeyButton} />
      <TeclaButton textButton="n" actionButton={handleKeyButton} />
      <TeclaButton textButton="m" actionButton={handleKeyButton} />
      <TeclaBorrarButton actionButton={handleKeyButton} />

      <TeclaEnterButton actionButton={handleKeyButton} />

      </div>
    </div>
  ) : (
    <></>
  )
)
};

export default TecladoAlfaNumerico;
