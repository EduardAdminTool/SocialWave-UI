"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import { Eye, EyeOff, WavesIcon as Wave } from "lucide-react";
import { FormTextField } from "@/components/Input";
import { ImagePicker } from "@/components/ImagePicker";
import { register } from "@/services/Auth/auth.service";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
  birthdate: string;
  name: string;
  bio: string;
  profilePicture: File | null;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 15,
          },
        },
      },
    },
  },
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, setValue } = useForm<FormData>();
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!data.profilePicture) {
      setErrorMessage("Please select a profile picture");
      setOpenModal(true);
      return;
    }

    const file = data.profilePicture;
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800; // Set the maximum width
          const maxHeight = 800; // Set the maximum height
          let { width, height } = img;

          // Resize the image while maintaining the aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (maxHeight / width) * height;
              width = maxWidth;
            } else {
              width = (maxWidth / height) * width;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Prepare the form data
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                });
                const formData = new FormData();
                formData.append("profilePicture", compressedFile);
                formData.append("email", data.email);
                formData.append("password", data.password);
                formData.append("birthdate", data.birthdate);
                formData.append("name", data.name);
                formData.append("bio", data.bio);

                register(formData)
                  .then(() => {
                    setOpenModal(true);
                    setErrorMessage(null); // Clear any previous error message
                  })
                  .catch((error) => {
                    console.error("Registration failed:", error);

                    const errorResponse = error?.response?.data;

                    if (errorResponse?.message) {
                      setErrorMessage(errorResponse.message);
                    } else {
                      setErrorMessage("Registration failed. Please try again.");
                    }

                    setOpenModal(true);
                  });
              }
            },
            file.type, // Keep the original file type (e.g., image/png or image/jpeg)
            0.7 // Compression quality (70%)
          );
        };
      }
    };

    reader.readAsDataURL(file); // Load the image as a DataURL for processing
  };

  const handleImageSelected = (file: File) => {
    setValue("profilePicture", file);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    // Redirect to /auth/login if the error message is null (successful registration)
    if (!errorMessage) {
      router.push("/auth/login"); // Redirect to login page
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Paper
            elevation={6}
            sx={{
              mt: 8,
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 4,
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Wave size={48} color="#3f51b5" />
            </motion.div>
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ mt: 2, fontWeight: "bold", color: "#3f51b5" }}
            >
              Join SocialWave
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3, width: "100%" }}
            >
              <FormTextField
                name="email"
                control={control}
                label="Email"
                type="email"
                required
                rules={{
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }}
              />
              <FormTextField
                name="password"
                control={control}
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                rules={{
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormTextField
                name="birthdate"
                control={control}
                label="Birthdate"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: new Date( // Sets min to 100 years ago
                    new Date().setFullYear(new Date().getFullYear() - 100)
                  )
                    .toISOString()
                    .split("T")[0],
                  max: new Date(
                    new Date().setFullYear(new Date().getFullYear() - 16)
                  )
                    .toISOString()
                    .split("T")[0], // Sets max to today's date minus 16 years
                }}
              />
              <FormTextField
                name="name"
                control={control}
                label="Name"
                required
              />
              <FormTextField
                name="bio"
                control={control}
                label="Bio"
                multiline
                rows={3}
                required
              />
              <Box sx={{ mt: 2, mb: 2 }}>
                <ImagePicker onImageSelected={handleImageSelected} />
              </Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: 56 }}
                >
                  Register
                </Button>
              </motion.div>
              <div className="flex w-full justify-between">
                <div>
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => router.push("/auth/login")}
                  >
                    Login here
                  </Button>
                </div>
              </div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {errorMessage ? "Registration Failed" : "Registration Successful"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {errorMessage
              ? errorMessage
              : "You will receive an email for confirmation. Please check your inbox."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            {errorMessage ? "Retry" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
