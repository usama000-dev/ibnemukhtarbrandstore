"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

// Step 1: Create Context
const GlobalVariableContext = createContext();

// Step 2: GlobalVariableProvider with logout
function GlobalVariableProvider({ children }) {
  const [disabled, setDisabled] = useState(true)
  const [token, setToken] = useState('')
  const whatsappNumber = "+923164288921";

  return (
    <GlobalVariableContext.Provider value={{ disabled, setDisabled, setToken, token, whatsappNumber }}>
      {children}
    </GlobalVariableContext.Provider>
  );
}

export default GlobalVariableProvider;

// Step 3: Custom hook
export const useGlobalVariabels = () => {
  const context = useContext(GlobalVariableContext);
  if (context === undefined) {
    throw new Error("useGloblevariables must be used within an GlobalVariableProvider");
  }
  return context;
};
