// components/FilterHeader.tsx
"use client";

import { IoGridOutline } from "react-icons/io5";
import { IconListDetails } from "@tabler/icons-react";
import { MdFilterList } from "react-icons/md";

interface FilterHeaderProps {
  totalItems: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

const FilterHeader = ({
  totalItems,
  isSidebarOpen,
  setIsSidebarOpen,
}: FilterHeaderProps) => {
  return (
    <div className="filter md:absolute md:top-20 md:left-[28%] flex items-center justify-between my-4 md:m-0">
      <span>{totalItems} :UNIFORMS</span>
      {/* <span>UNIFORMS: {totalItems} </span> */}
      <div className="filter-right flex space-x-2">
        {/* Sidebar filter toggle */}
        <button
          className="flex block md:hidden items-center justify-center gap-1 p-2 bg-gray-200 rounded-full text-2xl hover:text-orange-400 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="text-sm">Filters</span> <MdFilterList />
        </button>
      </div>
    </div>
  );
};

export default FilterHeader;
