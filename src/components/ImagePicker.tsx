import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";

interface ImagePickerProps {
  onImageSelected: (file: File) => void;
}

export function ImagePicker({ onImageSelected }: ImagePickerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span" startIcon={<Upload />}>
            Upload Profile Picture
          </Button>
        </label>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={previewUrl}
                alt="Profile preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="caption" display="block">
                Preview
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}
