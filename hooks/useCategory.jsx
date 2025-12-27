"use client";
import { cancelPendingRequests } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

// Step 1: Create Context
const CatContext = createContext();

// Step 2: AuthProvider with logout
function CatProvider({ children }) {
  const [allCategory, setAllCategory] = useState([]);
  const [featuredCategory, setFeaturedCategory] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setAllCategory(data.allCategories);
      setFeaturedCategory(data.featuredCategories);
      setPopularCategories(data.popularCategories);

      // console.log(data.allCategories);
      // console.log(data.popularCategories);
      // console.log(data.featuredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  return (
    <CatContext.Provider
      value={{ allCategory, featuredCategory, popularCategories }}
    >
      {children}
    </CatContext.Provider>
  );
}

export default CatProvider;

// Step 3: Custom hook
export const useCategory = () => {
  const context = useContext(CatContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within an CatProvider");
  }
  return context;
};
