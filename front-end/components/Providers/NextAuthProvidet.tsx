"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";


interface Child {
    children?: React.ReactNode
};

export const Provider = ({ children }: Child) => {
    return <SessionProvider>
        {children}
    </SessionProvider>
}