import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiTextField from "../common/MuiTextField";
import { createTaskApi, updateTaskApi } from "../../apis/tasks";
import { toast } from "react-toastify";

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  "&>div": {
    "&>*": {
      marginBottom: 15,
    },
  },
}));

export default function CreateOrUpdateTaskDialog({
  task = null,
  open = false,
  handleClose = () => {},
  addOrUpdateTask = () => {},
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setStatus(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error = {
      ...errors,
    };
    let hasError = false;
    if (!title?.trim()) {
      error["title"] = "Title is a required field.";
      hasError = true;
    }
    if (!description?.trim()) {
      error["description"] = "Description is a required field.";
      hasError = true;
    }
    if (hasError) {
      setErrors(error);
      return;
    }
    let payload = {
      title,
      description,
      status,
    };
    let response = null;
    setIsLoading(true);
    if (task) {
      response = await updateTaskApi(task?._id, payload);
    } else {
      response = await createTaskApi(payload);
    }
    if (response?.status) {
      handleClose();
      addOrUpdateTask(task ? "update" : "add", response?.data);
      toast.success(response?.message, 5000);
    } else {
      toast.error(response?.message, 5000);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (open && task) {
      setTitle(task?.title);
      setDescription(task?.description);
      setStatus(task?.status);
    }
    return () => handleClear();
  }, [open, task]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{task ? "Update" : "Create"} Task</DialogTitle>
        <StyledDialogContent>
          <Box width="100%" display={"flex"} flexDirection={"column"}>
            <MuiTextField
              placeholder="Title*"
              autoFocus={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              helperText={errors?.title}
              error={Boolean(errors?.title)}
            />
            <MuiTextField
              placeholder="Description*"
              multiline
              minRows={4}
              maxRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              helperText={errors?.description}
              error={Boolean(errors?.description)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
              }
              label="Mark as complete"
            />
          </Box>
        </StyledDialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            endIcon={isLoading && <CircularProgress size={20} />}
            disabled={isLoading}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
