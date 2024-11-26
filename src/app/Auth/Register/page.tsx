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
import { FormTextField } from "@/components/input";
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
    }
    if (data.profilePicture) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64Image = reader.result.toString(); // Base64 string
          const payload = {
            ...data,
            profilePicture: base64Image, // Replace File object with Base64 string
          };

          register(payload) // Register request
            .then(() => {
              // If registration is successful, show the modal
              setOpenModal(true);
              setErrorMessage(null); // Clear any previous error message
            })
            .catch((error) => {
              console.error("Registration failed:", error);

              // Check for error response from the server
              const errorResponse = error?.response?.data; // Assuming the API returns error details in 'response.data'

              // Set specific error message
              if (errorResponse?.message) {
                setErrorMessage(errorResponse.message); // Display specific error message
              } else {
                setErrorMessage("Registration failed. Please try again.");
              }

              setOpenModal(true); // Close the success modal if registration failed
            });
        }
      };
      reader.readAsDataURL(data.profilePicture); // Convert image to Base64
    } else {
      console.error("No profile picture selected");
    }
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
