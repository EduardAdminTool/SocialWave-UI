import React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { motion } from "framer-motion";

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, "name"> {
  name: Path<T>;
  control: Control<T>;
}

export function FormTextField<T extends FieldValues>({
  name,
  control,
  ...props
}: FormTextFieldProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Controller
        name={name}
        control={control}
        rules={props.required ? { required: `${props.label} is required` } : {}}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            {...props}
            error={!!error}
            helperText={error ? error.message : props.helperText}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        )}
      />
    </motion.div>
  );
}
