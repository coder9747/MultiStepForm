import React, { ReactElement, useState } from 'react'
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';


// const steps: Array<ReactElement> = [<Step1 />, <Step2/>]

const userFormCustomHook = (steps:Array<ReactElement>) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const next = () => {
        setActiveStep((pre) => {
            if (pre == steps.length - 1) return pre;
            return pre + 1;
        })
    }
    const pre = () => {
        setActiveStep((pre) => {
            if (pre <= 0) return 0;
            return pre - 1;
        })
    }
    return (
        {
            activeStep,
            step: steps[activeStep],
            isLast: activeStep == steps.length - 1,
            isFirst: activeStep == 0,
            next,
            pre
        }
    )
}

export default userFormCustomHook
