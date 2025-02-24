"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBarClient = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ProgressBar
                height="6px"
                color="#f000"
                options={{ showSpinner: true }}
                shallowRouting
                delay={3000}


            />
            {children}
        </>
    );
};

export default ProgressBarClient;
