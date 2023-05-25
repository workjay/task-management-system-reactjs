import { TextField, styled } from "@mui/material";
import React from "react";

const StyledTextField = styled(TextField)(({ theme }) => ({
  padding: "10px 15px",
  border: "2px solid #999",
  borderRadius: 5,
}));

export default function MuiTextField({
  placeholder = "",
  value = "",
  onChange = () => {},
  multiline = false,
  minRows,
  maxRows,
  autoFocus = false,
  required = false,
  helperText = "",
  error = false,
  type = "text",
  ...rest
}) {
  return (
    <StyledTextField
      placeholder={placeholder}
      variant="standard"
      value={value}
      onChange={onChange}
      multiline={multiline}
      minRows={minRows}
      maxRows={maxRows}
      InputProps={{ disableUnderline: true }}
      autoFocus={autoFocus}
      required={required}
      helperText={helperText}
      error={error}
      type={type}
      {...rest}
    />
  );
}
