"use client";

import React, { useEffect, useState } from "react";
import {
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
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { ShieldCheck as ShieldIcon } from "lucide-react";
import { confirmEmail } from "@/services/auth/auth.service";
import { useRouter, useSearchParams } from "next/navigation";

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
  },
});

export default function ConfirmEmailPage() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (id && token) {
      confirmEmail({ id, token })
        .then(() => {
          setMessage(
            "Your email has been successfully confirmed. You can now log in."
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
    } else {
      setMessage("Invalid or missing confirmation details.");
      setOpenModal(true);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setMessage(null);
    router.push("/auth/login");
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
              <ShieldIcon size={48} color="#3f51b5" />
            </motion.div>
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{ mt: 2, fontWeight: "bold", color: "#3f51b5" }}
            >
              Confirm Your Email
            </Typography>
          </Paper>
        </motion.div>
      </Container>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Email Confirmation</DialogTitle>
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
