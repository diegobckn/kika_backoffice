import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";

const BoxSelectList = ({ 
  listValues,
  selected,
  setSelected
}) => {
  return (
         listValues.map((valueItemList,ix)=>(
          <Button
            sx={{
              display:"inline-block",
              marginRight:"10px",
              backgroundColor:( selected == ix ? "#c9c9c9" : ""),
              color:( selected == ix ? "black" : ""),
              borderColor:( selected == ix ? "black" : ""),
              "&:hover":{
                borderColor: "black",
                backgroundColor: "#c9c9c9",
                color:"black",
                }
              }}
              variant={selected === ix ? "outlined" : "outlined"}
              onClick={() => {setSelected(ix)}}
              key={ix}
              >
            {valueItemList}
          </Button>
          ))
  );
};

export default BoxSelectList;
