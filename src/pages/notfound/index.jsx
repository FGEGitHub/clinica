import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";

export default function Paginas() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Página no encontrada";
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 2,
      }}
    >
      <Typography variant="h2" sx={{ mb: 2 }}>
        404
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Página no encontrada
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        La página que estás buscando no existe.
      </Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Volver al inicio
      </Button>

      <Typography variant="body2" sx={{ mt: 4, opacity: 0.7 }}>
        Para más información dirigirse a <strong>xxxx.com</strong>
      </Typography>
    </Box>
  );
}
