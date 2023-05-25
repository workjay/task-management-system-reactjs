import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";

export default function DeleteConfirmationDialog({
  open = false,
  handleClose = () => {},
}) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
      <DialogActions>
        <Button variant="outlined" onClick={() => handleClose(false)}>
          No
        </Button>
        <Button variant="contained" onClick={() => handleClose(true)}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
