import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper as StepperUI,
  Paper,
  Typography
} from "@mui/material";
import axios from "axios";

import Model from "../../Models/Model";
import SmallButton from "./SmallButton";

const StepperNavigator = ({
  title = "",
  textFinishButton = "Finalizar",
  children,
  changeStep = null,
  onComplete = () => { },
  endStep = null,
  onChangeStep = () => { },
  showNavigationButtons = false
}) => {

  const [activeStep, setActiveStep] = useState(0);
  const [stepsTitle, setStepsTitle] = useState([])
  const [finish, setFinish] = useState(false);


  useEffect(() => {
    // console.log("children", children)
    const stepsTitlesx = []
    for (let index = 0; index < children.length; index++) {
      stepsTitlesx.push("Paso " + (index + 1))
    }
    setStepsTitle(stepsTitlesx)
    setActiveStep(0)
    onChangeStep(null, 0)
  }, []);


  useEffect(() => {
    // console.log("cambio changeStep", changeStep)
    if (changeStep == activeStep) return
    if (changeStep != null && changeStep >= 0 && changeStep <= stepsTitle.length) {

      if (changeStep == stepsTitle.length) {
        onComplete()
        setFinish(true)
        return
      }else{
        setFinish(false)
      }
      // console.log("cambiando step active desde afuera..", changeStep)
      setActiveStep(changeStep)
    }
  }, [changeStep])

  return (
    <Container>
      <Paper
        sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
      >
        <Typography variant="h5">{title}</Typography>
      </Paper>
      <StepperUI activeStep={activeStep} alternativeLabel>
        {stepsTitle.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </StepperUI>
      <div>
        {children.map((child, ix) => {
          // if(activeStep !== ix) return null
          if(finish) return null
          return (
            <div key={ix} style={{
              display: (activeStep == ix ? "" : "none")
            }}>
              {child}
            </div>
          )
        })}

        { finish && (
          endStep
        ) }
      </div>

      {showNavigationButtons && (

        <div>
          <SmallButton textButton={"Volver"} actionButton={() => {
            setActiveStep(activeStep - 1)
            onChangeStep(activeStep, activeStep - 1)
          }} isDisabled={activeStep === 0} />

          <SmallButton textButton={"Siguiente"} actionButton={() => {
            setActiveStep(activeStep + 1)
            onChangeStep(activeStep, activeStep + 1)
          }} isDisabled={activeStep == (stepsTitle.length - 1)} />

          <SmallButton textButton={textFinishButton} actionButton={() => {
            onComplete()
          }} isDisabled={activeStep != (stepsTitle.length - 1)} />
        </div>
      )}
    </Container>
  );
};

export default StepperNavigator;
