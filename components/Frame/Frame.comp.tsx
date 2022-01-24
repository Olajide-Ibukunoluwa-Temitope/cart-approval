import Head from 'next/head';
import React, { ReactNode } from 'react';

interface FrameProps {
    children: ReactNode
}

const Frame = ({children}: FrameProps) => {
  return(
    <div>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        </Head>
        <div>
            {children}
        </div>
    </div>
  );
};

export default Frame;
