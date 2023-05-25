import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreateOrUpdateTaskDialog from "./CreateOrUpdateTaskDialog";

export default function CreateTask({ addOrUpdateTask }) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        sx={{ mb: 2 }}
      >
        <Button
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpen(true)}
          variant="contained"
        >
          Create Task
        </Button>
      </Box>
      <CreateOrUpdateTaskDialog
        open={open}
        handleClose={handleClose}
        addOrUpdateTask={addOrUpdateTask}
      />
    </>
  );
}
