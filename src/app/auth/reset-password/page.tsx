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
} from "@mui/material";
import { motion } from "framer-motion";
import { Lock as LockIcon } from "lucide-react";
import { FormTextField } from "@/components/Input";
import { resetPassword } from "@/services/Auth/auth.service";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResetPasswordDto } from "@/dtos/auth/reset-password.dto";

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
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const { control, handleSubmit } = useForm<FormData>();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleCloseModal = () => {
    if (
      message ===
      "Your password has been successfully reset. You can now log in."
    ) {
      router.push("/auth/login");
    }
    setOpenModal(false);
  };
  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (id && token) {
      return;
    } else {
      router.push("/auth/login");
    }
  }, [searchParams]);
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      setOpenModal(true);
      return;
    }
    const payload: ResetPasswordDto = {
      token: searchParams.get("token") || "",
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    resetPassword(payload)
      .then(() => {
        setMessage(
          "Your password has been successfully reset. You can now log in."
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
              <LockIcon size={48} color="#3f51b5" />
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
                name="password"
                control={control}
                label="New Password"
                type="password"
                required
              />
              <FormTextField
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
                required
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
                  Reset Password
                </Button>
              </motion.div>
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
