/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import SearchListCategoriesItem from "./SearchListCategoriesItem";


const ITEMS_PER_PAGE = 10;
const SearchListCategories = ({
  refresh = null
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [doRefresh, setDoRefresh] = useState(false);

  const setPageCount = (categoriesCount) => {
    setTotalPages(Math.ceil(categoriesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageCategories(
      filteredCategories.slice(
        ITEMS_PER_PAGE * (currentPage - 1),
        ITEMS_PER_PAGE * currentPage
      )
    );
  };

  const fetchCategories = async () => {
    // showLoading("Cargando categorias...")
    Product.getInstance().getCategories((cats) => {
      setCategories(cats);
      setPageCount(cats.length);
    }, showMessage)

  };

  useEffect(() => {
    fetchCategories();
  }, [doRefresh]);

  useEffect(() => {
    setFilteredCategories(
      categories.filter(
        (category) =>
          // category.descripcion &&
          category.descripcion
            .trim()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categories]);

  useEffect(() => {
    updatePageData();
  }, [searchTerm, categories, currentPage, filteredCategories]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCategories.length / ITEMS_PER_PAGE));
  }, [filteredCategories]);

  useEffect(() => {
    setDoRefresh(!doRefresh)
  }, [refresh])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField
        label="Buscar categoría..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Categoría</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No se encontraron categorías</TableCell>
            </TableRow>
          ) : (
            pageCategories.map((category, ix) => (
              <SearchListCategoriesItem key={ix}
                item={category}
                onUpdate={() => {
                  setDoRefresh(!doRefresh)
                }}
                onDelete={() => {
                  setDoRefresh(!doRefresh)
                }}
              />
            ))
          )}
        </TableBody>
      </Table>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
      
    </Box>
  );
};

export default SearchListCategories;
