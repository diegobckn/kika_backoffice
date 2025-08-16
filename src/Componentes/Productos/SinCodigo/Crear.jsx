import React, { useState, useEffect } from "react";
import Paso1 from "./Pasos/Paso1";
import Paso2 from "./Pasos/Paso2";
import PasoFinalCrear from "../PasoFinalCrear";
import StepperSimple from "../../Elements/StepperSimple";

const Crear = ({
  onSuccessAdd
}) => {

  const guardar = (dataSteps) => {
    // console.log("guardo el nuevo producto con estos datos", dataSteps)
    onSuccessAdd(dataSteps[1])
  }

  return (
    <StepperSimple
      title={"Crear producto sin codigo"}
      endStep={<PasoFinalCrear mostrarBotones={false} />}
      onComplete={guardar}
    >
      <Paso1 />
      <Paso2 />
    </StepperSimple>
  );
};

export default Crear;
