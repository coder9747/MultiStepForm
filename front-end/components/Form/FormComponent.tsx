"use client";
import React, { useContext, useEffect } from 'react';
import { Box, CssBaseline, Paper, Step, StepLabel, Stepper, Button, useMediaQuery, useTheme, MobileStepper } from '@mui/material';
import userFormCustomHook from './userFormCustomHook';
import Step1 from './Steps/Step1';
import { FormContext } from '../Providers/FormProvider';
import Educations from './Steps/Educations';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import FatherDocument from './Steps/FatherDocument';

const steps = ['General Information', 'Permanent Address', 'Education', 'Cibil Information', 'Reference Information', 'Work Experience', 'Father’s Document'];

const FormComponent = () => {
    const { activeStep, step, isFirst, isLast, next, pre } = userFormCustomHook([<Step1 />, <Step2 />, <Educations />, <Step4 />, <Step3 />, <Step5 />, <FatherDocument />]);

    const val = useContext(FormContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        val.setState({ activeStep, isFirst, isLast, next, pre });
    }, []);

    return (
        <CssBaseline>
            <Box component="div" className="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:p-16 lg:p-10">
                <Paper component="div" className="w-full max-w-6xl p-6 sm:p-8 md:p-16 lg:p-10">
                    <div className="mb-8">
                        {isMobile ? (
                            <div className="flex overflow-x-scroll space-x-4 pb-2 border-b border-gray-200">
                                {steps.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 ${activeStep === index ? 'border-b-4 border-blue-500' : 'border-b-4 border-transparent'} flex-shrink-0`}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Stepper alternativeLabel activeStep={activeStep} className="w-full text-2xl">
                                {steps.map((item, index) => (
                                    <Step key={index}>
                                        <StepLabel>{item}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                    </div>
                    <div className="mt-12 text-xl">{step}</div>
                        {/* <div className="flex justify-between mt-8">
                            <Button disabled={isFirst} onClick={pre} variant="contained" className="text-xl">
                                Previous
                            </Button>
                            {!isLast ? (
                                <Button onClick={next} variant="contained" color="primary" className="text-xl">
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={next} variant="contained" color="primary" className="text-xl">
                                    Finish
                                </Button>
                            )}
                        </div> */}
                </Paper>
            </Box>
        </CssBaseline>
    );
};

export default FormComponent;
