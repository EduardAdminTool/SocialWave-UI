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
  Link,
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, setValue } = useForm<FormData>();
  const [openModal, setOpenModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormData> = (data) => {};

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
              <div>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  variant="body2"
                  sx={{ display: "block", mt: 2 }}
                >
                  Create one here
                </Link>
              </div>

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
    </ThemeProvider>
  );
}
