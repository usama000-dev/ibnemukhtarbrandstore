'use client'
import { cancelPendingRequests } from "@/services/api";
import { createContext, useState, useEffect } from "react";

interface DashboardContextProps {
    isMobileSidebar: boolean,
    setIsMobileSidebar: (value: boolean) => void,
    isSidebarOpen: boolean,
    setSidebarOpen: (value: boolean) => void,
    pendingOrdersLength: number,
}

let initDashboard = {
    isMobileSidebar: false,
    setIsMobileSidebar: () => { },
    isSidebarOpen: false,
    setSidebarOpen: () => { },
    pendingOrdersLength: 0
}

export const DashboardContext = createContext<DashboardContextProps>(initDashboard);

export const DashboardContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobileSidebar, setIsMobileSidebar] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [pendingOrdersLength, setPendingOrdersLength] = useState(0);

    // Fetching the pending orders length on component mount
    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const res = await fetch("/api/get-confirm-order", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const result = await res.json();
                // console.log(result);  // Check the API response structure

                if (result && result.proofs) {
                    setPendingOrdersLength(result.proofs.length);  // Assuming 'proofs' contains the pending orders
                }
            } catch (error) {
                console.error("Error fetching pending orders:", error);
            }
        };

        fetchPendingOrders();
        return () => {
            cancelPendingRequests();
          };
    }, []);  // Empty dependency array ensures this runs only once on mount

    return (
        <DashboardContext.Provider value={{ 
            isMobileSidebar, 
            setIsMobileSidebar, 
            isSidebarOpen, 
            setSidebarOpen, 
            pendingOrdersLength
        }}>
            {children}
        </DashboardContext.Provider>
    );
}
