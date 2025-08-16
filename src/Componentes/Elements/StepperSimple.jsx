import React, { useState, useEffect, cloneElement } from "react";
import StepperNavigator from "./StepperNavigator";

const StepperSimple = ({
  title,
  endStep,
  onComplete,
  children
}) => {

  const [datas, setDatas] = useState([])
  const [step, setStep] = useState(null)

  const onChangeStep = (prevStep, currentStep) => {
    // console.log("cambio del paso ", prevStep, " al ", currentStep)
    setStep(currentStep)
    setTimeout(() => {
      setStep(null)
    }, 500);
  }

  const onNext = (stepData, stepIndex) => {
    // console.log("onNext de paso 1.. data", stepData)
    datas[stepIndex] = stepData
    setDatas([...datas])
    setStep(stepIndex + 1)
  }

  const onBack = (stepIndex) => {
    if (stepIndex > 0) {
      setStep(stepIndex - 1)
    }
  }

  return (
    <StepperNavigator
      title={title}
      changeStep={step}
      endStep={cloneElement(endStep,{
        dataSteps: datas
      })}
      onChangeStep={onChangeStep}
      onComplete={() => {
        // console.log("hizo todos los pasos")
        onComplete(datas)
      }}
    >

      {children.map((child, ix) => {
        return cloneElement(child,{
          key:ix,
          isActive: (step === ix),
          dataSteps: datas,
          onNext:(info) => {
            onNext(info, ix)
          },
          onBack:() => {
            onBack(ix)
          }
        })
      })}
    </StepperNavigator>
  );
};

export default StepperSimple;
