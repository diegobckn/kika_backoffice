/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import { Box, TextField, Table, IconButton, TableBody, Pagination, TableCell, TableHead, TableRow, MenuItem, Grid } from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import SelectFetch from "../Elements/Compuestos/SelectFetch";
import SearchListSubCategoriesItem from "./SearchListSubCategoriesItem";

const ITEMS_PER_PAGE = 10;
const SearchListSubCategories = ({
  refresh = null,
  onChageCategory = () => { }
}) => {
  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const apiUrl = ModelConfig.get().urlBase;

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [editSubCategoryData, setEditSubCategoryData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [doRefresh, setDoRefresh] = useState(null);

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
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  //
  useEffect(() => {
    setTotalPages(Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE));
  }, [filteredSubCategories]);

  const fetchCategories = async () => {
    Product.getInstance().getCategories((cats) => {
      setCategories(cats)
    }, showMessage)
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setDoRefresh(!doRefresh)
  }, [refresh]);

  useEffect(() => {
    onChageCategory(selectedCategoryId)
  }, [selectedCategoryId]);



  const fetchSubCategories = async () => {
    Product.getInstance().getSubCategories(selectedCategoryId, (subs) => {
      setSubCategories(subs)
    }, showMessage)
  };

  useEffect(() => {
    if (selectedCategoryId != -1 && doRefresh != null) {
      fetchSubCategories();
    }
  }, [selectedCategoryId, doRefresh]);

  useEffect(() => {
    if (Array.isArray(subcategories)) {
      setFilteredSubCategories(
        subcategories.filter((subcategory) =>
          subcategory.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
          // subcategory.descripcion && subcategory.descripcion.trim().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, subcategories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />

      <Grid item xs={12} sm={6} md={12} lg={12}>
        <br />
        <SelectFetch
          inputState={[selectedCategoryId, setSelectedCategoryId]}
          fetchFunction={Product.getInstance().getCategories}
          fetchDataShow={"descripcion"}
          fetchDataId={"idCategoria"}
          fieldName={"Categoria"}
          required={true}

          onFinishFetch={async () => {
            // cargaAnteriorDeSesion(setSelectedCategoryId, "ultimaCategoriaGuardada")
          }}
        />
      </Grid>


      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Sub-Categoría</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSubCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No hay subcategorias para mostrar</TableCell>
            </TableRow>
          ) : (
            filteredSubCategories.map((subcategory, ix) => (
              <SearchListSubCategoriesItem key={ix}
                item={subcategory}
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

export default SearchListSubCategories;









