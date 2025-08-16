import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
const LoadingDialog = ({openDialog, text}) => {
    /**
  How to use:
  
  import LoadingDialog from "../Components/Dialogs/LoadingDialog";

  ...

  <LoadingDialog openDialog = {openLoadingDialog} text={loadingDialogText} />

  ...
  
  <Button
    onClick={()=>{ 
      setOpenLoadingDialog(true)
      setTimeout(() => {
        setOpenLoadingDialog(false)
      }, 2000);
    }}
  >
    Test loading dialog
  </Button>
      
  */
  return (
    <Dialog
      open={openDialog}
      onClose={ () => {} }
    >
      <DialogContent style={{
        textAlign: "center"
      }}>
        <CircularProgress/>
        <Typography>{text}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
