"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/ui/table";
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";

export default function BasicTableOne(uniform) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniform, setSelectedUniform] = useState({});
  const [image, setImage] = useState(null);
  const defaultImage = `${uniform?.imageUrl}`; // Default image
  const uniforms = [
    {
      id: 1,
      company: "Nike",
      size: 140,
      status: "available",
      uppercolor: "blue",
      trowsercolor: "black",
      collarcolor: "white",
      productno: 701,
      neckstyle: "V-neck",
      sleeveStyle: "half sleeve",
      poomseOrNot: "yes",
      category: "A+",
    },
    {
      id: 2,
      company: "Adidas",
      size: 150,
      status: "out of stock",
      uppercolor: "red",
      trowsercolor: "white",
      collarcolor: "black",
      productno: 702,
      neckstyle: "round",
      sleeveStyle: "full sleeve",
      poomseOrNot: "no",
      category: "B",
    },
    {
      id: 3,
      company: "Puma",
      size: 120,
      status: "available",
      uppercolor: "green",
      trowsercolor: "black",
      collarcolor: "white",
      productno: 703,
      neckstyle: "close",
      sleeveStyle: "half sleeve",
      poomseOrNot: "",
      category: "A",
    },
    {
      id: 4,
      company: "Reebok",
      size: 135,
      status: "available",
      uppercolor: "black",
      trowsercolor: "gray",
      collarcolor: "red",
      productno: 704,
      neckstyle: "V-neck",
      sleeveStyle: "full sleeve",
      poomseOrNot: "yes",
      category: "C",
    },
    {
      id: 5,
      company: "Fila",
      size: 130,
      status: "out of stock",
      uppercolor: "white",
      trowsercolor: "blue",
      collarcolor: "white",
      productno: 705,
      neckstyle: "round",
      sleeveStyle: "half sleeve",
      poomseOrNot: "",
      category: "A+",
    },
    {
      id: 6,
      company: "Under Armour",
      size: 125,
      status: "available",
      uppercolor: "yellow",
      trowsercolor: "black",
      collarcolor: "white",
      productno: 706,
      neckstyle: "close",
      sleeveStyle: "full sleeve",
      poomseOrNot: "no",
      category: "B",
    },
    {
      id: 7,
      company: "Asics",
      size: 145,
      status: "available",
      uppercolor: "white",
      trowsercolor: "red",
      collarcolor: "blue",
      productno: 707,
      neckstyle: "V-neck",
      sleeveStyle: "half sleeve",
      poomseOrNot: "yes",
      category: "C",
    },
    {
      id: 8,
      company: "Mizuno",
      size: 155,
      status: "out of stock",
      uppercolor: "orange",
      trowsercolor: "black",
      collarcolor: "gray",
      productno: 708,
      neckstyle: "round",
      sleeveStyle: "full sleeve",
      poomseOrNot: "",
      category: "A",
    },
    {
      id: 9,
      company: "New Balance",
      size: 132,
      status: "available",
      uppercolor: "gray",
      trowsercolor: "black",
      collarcolor: "white",
      productno: 709,
      neckstyle: "close",
      sleeveStyle: "half sleeve",
      poomseOrNot: "no",
      category: "B",
    },
    {
      id: 10,
      company: "Yonex",
      size: 148,
      status: "available",
      uppercolor: "blue",
      trowsercolor: "white",
      collarcolor: "black",
      productno: 710,
      neckstyle: "V-neck",
      sleeveStyle: "full sleeve",
      poomseOrNot: "yes",
      category: "A+",
    },
  ];

  console.log("line 156", uniforms);

  const ITEMS_PER_PAGE = 5;
  const handleDlete = () => {
    console.log("delete");
    alert("delete");
  };
  const handleEdite = (id) => {
    const findItem = uniforms.find((item) => item.id === id);
   setSelectedUniform(findItem)
    console.log("find by id : ", findItem);
    alert(`"editeed" ${id}`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Show new image preview
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUniform((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // console.log("line 53 field name is : ",name," value is : ",value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("line 57 compltee object", selectedUniform);

    setSelectedUniform({
      company: selectedUniform?.company || uniform?.company,
      size: selectedUniform?.size || uniform?.size,
      status: selectedUniform?.status || uniform?.status,
      uppercolor: selectedUniform?.uppercolor || uniform?.uppercolor,
      trowsercolor: selectedUniform?.trowsercolor || uniform?.trowsercolor,
      collarcolor: selectedUniform?.collarcolor || uniform?.collarcolor,
      productno: selectedUniform?.productno || uniform?.productno,
      neckstyle: selectedUniform?.neckstyle || uniform?.neckstyle,
      sleeveStyle: selectedUniform?.sleeveStyle || uniform?.sleeveStyle,
      poomseOrNot: selectedUniform?.poomseOrNot || uniform?.poomseOrNot,
      category: selectedUniform?.category || uniform?.category,
      imageUrl: image || defaultImage,
    });
  };

  const totalPages = Math.ceil(uniforms?.length / ITEMS_PER_PAGE);
  const currentData = uniforms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] border border-gray-300">
      <div className="max-w-full overflow-x-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-2 p-4 border rounded-lg shadow-md bg-white"
        >
          <input
          value={setSelectedUniform.company}
            name="company"
            onChange={handleChange}
            type="text"
            placeholder="Company"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.size}
            name="size"
            onChange={handleChange}
            type="number"
            placeholder="Size"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <select
          value={selectedUniform.category}
            name="category"
            id="category"
            onChange={handleChange}
            className="border p-2 rounded w-full sm:w-auto"
          >
            <option>Category</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
          </select>
          <input
          value={setSelectedUniform.status}
            name="status"
            onChange={handleChange}
            type="text"
            placeholder="Status"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.uppercolor}
            name="upperColor"
            onChange={handleChange}
            type="text"
            placeholder="Upper Color"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.trowsercolor}
            name="trowserColor"
            onChange={handleChange}
            type="text"
            placeholder="Trowser Color"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.collarcolor}
            name="collarColor"
            onChange={handleChange}
            type="text"
            placeholder="Collar Color"
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.productno}
            name="uniform?FormatNumber"
            onChange={handleChange}
            type="number"
            placeholder="Product No."
            className="border p-2 rounded w-full sm:w-auto"
          />
          <input
          value={setSelectedUniform.poomseOrNot}
            name="poomsaOrNot"
            onChange={handleChange}
            type="text"
            placeholder="Poomsae Or Not"
            className="border p-2 rounded w-full sm:w-auto"
          />
        

          {/* Image Field */}
          <div className="flex items-center gap-2 border p-2 rounded w-full sm:w-auto">
            <img
              src={image || defaultImage}
              alt="Preview"
              className="w-12 h-12 rounded object-cover"
            />
            <input
            value={setSelectedUniform}
              name="imageUrl"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Submit
          </button>
        </form>
        <div className="min-w-[1102px]">
          <Table className="border border-gray-300 ">
            <TableHeader className="border-b border-gray-300">
              <TableRow className="border-b border-gray-300">
                {[
                  "company",
                  "Size",
                  "Category",
                  "Status",
                  "Upper Color",
                  "Trowser Color",
                  "Collar Color",
                  "Product no.",
                  "PoomsaOrNot",
                  "Collar Style",
                  "Delete",
                  "Edit",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-5 py-3 text-indigo-500 font-[600] text-start text-theme-xs border-r border-gray-300"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.map((uniform) => (
                <TableRow
                  key={uniform?.id}
                  className="border-b border-gray-300 "
                >
                  {[
                    uniform?.company,
                    uniform?.size,
                    uniform?.category,
                    uniform?.status,
                    uniform?.uppercolor,
                    uniform?.trowsercolor,
                    uniform?.collarcolor,
                    uniform?.productno,
                    uniform?.poomseOrNot,
                    uniform?.neckstyle,
                  ].map((data, idx) => (
                    <TableCell
                      key={idx}
                      className="px-4 py-3 text-gray-500 text-theme-sm text-center dark:text-gray-400 border-r border-gray-300"
                    >
                      {data}
                    </TableCell>
                  ))}
                  <TableCell className="px-4 py-3 text-center border-r border-gray-300">
                    <button
                      onClick={handleDlete}
                      className="text-xl hover:text-red-500"
                    >
                      <MdDelete />
                    </button>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleEdite(uniform?.id)}
                      className="text-xl hover:text-indigo-500"
                    >
                      <AiFillEdit />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-center gap-2 py-4">
        <button
          className={`px-3 py-1 rounded border border-gray-300 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-1 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-3 py-1 rounded border border-gray-300 ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
