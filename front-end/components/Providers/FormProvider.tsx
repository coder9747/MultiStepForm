import { createContext, ReactNode, useState } from "react";

type FormContextType = object;

export const FormContext = createContext<FormContextType | null>(null);

interface FormProviderProps {
    children: ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
    const [state,setState] = useState();
    return (
        <FormContext.Provider value={{state,setState}}>
            {children}
        </FormContext.Provider>
    );
};
