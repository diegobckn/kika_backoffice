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
  MenuItem,
  IconButton,
  Grid,
  Select,
  InputLabel,
  Pagination,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SearchListFamiliasItem from "./SearchListFamiliasItem";
import Product from "../../Models/Product";

import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import SelectFetch from "../Elements/Compuestos/SelectFetch";


const ITEMS_PER_PAGE = 10;

const SearchListFamilias = ({
  refresh = null,
  onChageCategory = () => { },
  onChageSubCategory = () => { },
}) => {

  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredFamilies, setFilteredFamilies] = useState([]);

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(-1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);

  const [totalPages, setTotalPages] = useState(0);
  const [pageCategories, setPageCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [doRefresh, setDoRefresh] = useState(null);

  const setPageCount = (categoriesCount) => {
    setTotalPages(Math.ceil(categoriesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {
    setPageFamilies(
      filteredFamilies.slice(
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
    setTotalPages(Math.ceil(filteredFamilies.length / ITEMS_PER_PAGE));
  }, [setFilteredFamilies]);

  useEffect(() => {
    setDoRefresh(!doRefresh)
  }, [refresh]);

  const fetchFamilies = async () => {
    Product.getInstance().getFamiliaBySubCat({
      categoryId: selectedCategoryId,
      subcategoryId: selectedSubCategoryId
    }, (fams) => {
      setFamilies(fams)
    }, showMessage)
  };

  useEffect(() => {
    fetchFamilies();
  }, [selectedSubCategoryId]);

  useEffect(() => {
    if (selectedCategoryId != -1 && selectedSubCategoryId != -1 && doRefresh != null) {
      fetchFamilies();
    }
  }, [selectedCategoryId, selectedSubCategoryId, doRefresh]);

  useEffect(() => {
    onChageCategory(selectedCategoryId)
    onChageSubCategory(selectedSubCategoryId)
  }, [selectedCategoryId, selectedSubCategoryId]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <TextField label="Buscar..." value={searchTerm} onChange={handleSearch} />
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12}>



              <Grid item xs={12} sm={12} md={12} lg={12}>
                <SelectFetch
                  inputState={[selectedCategoryId, setSelectedCategoryId]}
                  // validationState={validatorStates.selectedCategoryId}
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

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <SelectFetchDependiente
                  inputState={[selectedSubCategoryId, setSelectedSubCategoryId]}
                  inputOtherState={[selectedCategoryId, setSelectedCategoryId]}
                  // validationState={validatorStates.selectedSubCategoryId}
                  fetchFunction={(cok, cwr) => {
                    Product.getInstance().getSubCategories(selectedCategoryId, cok, cwr)
                  }}
                  fetchDataShow={"descripcion"}
                  fetchDataId={"idSubcategoria"}
                  fieldName={"SubCategoria"}
                  required={true}
                  onFinishFetch={async () => {
                    // cargaAnteriorDeSesion(setSelectedSubCategoryId, "ultimaSubcategoriaGuardada")
                  }}
                />

              </Grid>



            </Grid>
          </Grid>
        </Box>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Familia</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {families && families.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2}>No hay familias para mostrar</TableCell>
            </TableRow>
          ) : (
            families.map((family, ix) => (
              <SearchListFamiliasItem
                item={family}
                key={ix}
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

export default SearchListFamilias;
