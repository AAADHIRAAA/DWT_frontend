"use client"
import { ClerkProvider } from "@clerk/nextjs";



function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    
    <ClerkProvider {...pageProps}>
       
      <Component {...pageProps} />
      
    </ClerkProvider>
    
  );
}

export default MyApp;
