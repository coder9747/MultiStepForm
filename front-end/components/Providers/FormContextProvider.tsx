"use client";
import { FormProvider } from "./FormProvider";

export default function ({ children }: { children: React.ReactElement }) {
    return <FormProvider>
        {children}
    </FormProvider>

}