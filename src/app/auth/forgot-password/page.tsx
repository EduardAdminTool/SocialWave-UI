"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
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
import { WavesIcon as Wave } from "lucide-react";
import { FormTextField } from "@/components/Input";
import { forgotPassword } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

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

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { control, handleSubmit } = useForm<FormData>();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleCloseModal = () => {
    if (
      message ===
      "A password reset link has been sent to your email. Please check your inbox."
    ) {
      setOpenModal(false);
      setMessage(null);
      router.push("/auth/login");
    } else {
      setOpenModal(false);
      setMessage(null);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    forgotPassword(data.email)
      .then(() => {
        setMessage(
          "A password reset link has been sent to your email. Please check your inbox."
        );
        setOpenModal(true);
      })
      .catch((error) => {
        console.log("Error received:", error);
        const errorMessage =
          error.response?.data?.message || "An unknown error occurred.";
        setMessage(errorMessage);
        setOpenModal(true);
      });
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
              Reset Your Password
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
                defaultValue={""}
                required
                rules={{
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }}
              />

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
                  Send Reset Link
                </Button>
              </motion.div>

              <Link
                href="#"
                onClick={() => router.push("/auth/login")}
                variant="body2"
                sx={{ display: "block", textAlign: "center", mt: 2 }}
              >
                Back to Login
              </Link>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Password Reset</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
