/* eslint-disable react-hooks/exhaustive-deps */
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
import ModelConfig from "../../Models/ModelConfig";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import SelectFetchDependiente from "../Elements/Compuestos/SelectFetchDependiente";
import SelectFetch from "../Elements/Compuestos/SelectFetch";
import SearchListSubFamiliasItem from "./SearchListSubFamiliasItem";

const ITEMS_PER_PAGE = 10;

const SearchListSubFamilias = ({
  refresh = null,
  onChageCategory = () => { },
  onChageSubCategory = () => { },
  onChageFamily = () => { },
}) => {
  const {
    showLoading,
    hideLoading,
    showMessage
  } = useContext(SelectedOptionsContext);
  const apiUrl = ModelConfig.get().urlBase;

  const [searchTerm, setSearchTerm] = useState("");
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(-1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
  const [selectedFamilyId, setSelectedFamilyId] = useState(-1);


  const [subcategories, setSubCategories] = useState([]);
  const [filteredSubFamilies, setFilteredSubFamilies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editSubFamilyData, setEditSubFamilyData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSubFamilies, setPageSubFamilies] = useState([]);

  const [doRefresh, setDoRefresh] = useState(null);

  const setPageCount = (subFamiliesCount) => {
    setTotalPages(Math.ceil(subFamiliesCount / ITEMS_PER_PAGE));
  };

  const updatePageData = () => {

    console.log("setPageSubFamilies:")
    console.log(filteredSubFamilies.slice(
      ITEMS_PER_PAGE * (currentPage - 1), // 10 * (1 - 1)///////0
      ITEMS_PER_PAGE * currentPage ///////// 10 * 1//////////10
    ))


    setPageSubFamilies(
      filteredSubFamilies.slice(
        ITEMS_PER_PAGE * (currentPage - 1), // 10 * (1 - 1)///////0
        ITEMS_PER_PAGE * currentPage ///////// 10 * 1//////////10
      )
    );
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    setPageCount(subfamilies.length);
    updatePageData();
    console.log("cantidad de paginas:" + Math.ceil(filteredSubFamilies.length / ITEMS_PER_PAGE))
    setTotalPages(Math.ceil(filteredSubFamilies.length / ITEMS_PER_PAGE));
  }, [filteredSubFamilies]);


  const fetchSubFamilies = async () => {
    Product.getInstance().getSubFamilia({
      categoryId: selectedCategoryId,
      subcategoryId: selectedSubCategoryId,
      familyId: selectedFamilyId,
    }, (fams) => {
      setSubFamilies(fams)
    }, showMessage)
  };

  useEffect(() => {
    console.log("cambio datos")
    setFilteredSubFamilies(subfamilies);
  }, [subfamilies]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredSubFamilies = subfamilies.filter((subfamily) =>
      subfamily.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubFamilies(filteredSubFamilies);
    setPageCount(filteredSubFamilies.length);
    updatePageData();
  };

  useEffect(() => {
    setDoRefresh(!doRefresh)
  }, [refresh]);


  useEffect(() => {
    if (selectedCategoryId != -1
      && selectedSubCategoryId != -1
      && selectedFamilyId != -1
      && doRefresh != null) {
      fetchSubFamilies();
    }
  }, [ selectedFamilyId, doRefresh]);

  useEffect(() => {
    onChageCategory(selectedCategoryId)
    onChageSubCategory(selectedSubCategoryId)
    onChageFamily(selectedFamilyId)
  }, [selectedCategoryId, selectedSubCategoryId, selectedFamilyId]);

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

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <SelectFetchDependiente
                  inputState={[selectedFamilyId, setSelectedFamilyId]}
                  inputOtherState={[selectedSubCategoryId, setSelectedSubCategoryId]}
                  // validationState={validatorStates.selectedSubCategoryId}
                  fetchFunction={(cok, cwr) => {
                    Product.getInstance().getFamiliaBySubCat({
                      categoryId: selectedCategoryId,
                      subcategoryId: selectedSubCategoryId
                    }, cok, cwr)
                  }}
                  fetchDataShow={"descripcion"}
                  fetchDataId={"idFamilia"}
                  fieldName={"Familia"}
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
            <TableCell>ID Sub-Familia</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pageSubFamilies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                No hay sub-familias para mostrar
              </TableCell>
            </TableRow>
          ) : (
            pageSubFamilies.map((item, ix) => (
              <SearchListSubFamiliasItem
                key={ix}
                item={item}
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
      />
    </Box>
  );
};

export default SearchListSubFamilias;
