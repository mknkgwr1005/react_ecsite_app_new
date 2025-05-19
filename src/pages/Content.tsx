import React, { createContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { RegisterConfirm } from "../components/Register/RegisterConfirm";
import { User } from "../types/User";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RegisterInfo } from "./RegisterUser";

function getSteps() {
  return ["入力画面", "確認画面"];
}

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return <RegisterInfo />;
    case 1:
      return <RegisterConfirm />;
    default:
      return "Unknown stepIndex";
  }
}

export function Content() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const handleNext = () => {
    setActiveStep((steps) => steps + 1);
  };
  const handleBack = () => {
    setActiveStep((steps) => steps - 1);
    // setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid container>
      <Grid sm={2} />
      <Grid lg={8} sm={8} spacing={10}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <div>
            <Typography>全ステップの表示を完了</Typography>
            <Button onClick={handleReset}>リセット</Button>
          </div>
        ) : (
          <div>
            {/* <Typography>{getStepContent(activeStep)}</Typography> */}
            <Button disabled={activeStep === 0} onClick={handleBack}>
              戻る
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? "送信" : "次へ"}
            </Button>
          </div>
        )}
      </Grid>
    </Grid>
  );
}
