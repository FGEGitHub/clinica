import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import loginService from "../../services/login";
import servicioUsuario from "../../services/usuarios";

const Login = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [error, setError] = useState("");

  const colors = {
    primary: "#102A43",
    primaryHover: "#193B59",
    accent: "#16A6A3",
    accentHover: "#128784",
    background: "#F3F6FA",
    text: "#172B4D",
    muted: "#718096",
    border: "#DCE4ED",
  };

  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem(
        "loggedNoteAppUser"
      );

      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);

        if (user.nivel === 1 || user.nivel === "1") {
          navigate("/usuario/turnos", { replace: true });
        }
      }
    } catch (error) {
      console.error("No se pudo recuperar la sesión:", error);
    }
  }, [navigate]);

  const handleChange = (event) => {
    setUsuario((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setError("");
  };

  const loginSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!usuario.usuario.trim() || !usuario.password) {
      setError("Ingresá tu usuario y contraseña para continuar.");
      return;
    }

    setLoading(true);

    try {
      const user = await loginService.login({
        usuario: usuario.usuario.trim(),
        password: usuario.password,
      });

      if (!user) {
        throw new Error("Respuesta de autenticación inválida");
      }

      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(user)
      );

      servicioUsuario.setToken(user.token);

      if (user.nivel === 1 || user.nivel === "1") {
        navigate("/usuario/turnos", { replace: true });
      } else {
        setError(
          "Tu cuenta no tiene un acceso configurado para esta plataforma."
        );
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(
        "No pudimos iniciar sesión. Verificá tus credenciales e intentá nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        background: `
          radial-gradient(
            circle at 10% 10%,
            rgba(22, 166, 163, 0.09),
            transparent 32%
          ),
          radial-gradient(
            circle at 90% 90%,
            rgba(16, 42, 67, 0.07),
            transparent 30%
          ),
          #F3F6FA
        `,
        fontFamily: '"Inter", "Roboto", sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(220, 228, 237, 0.8)",
          borderRadius: { xs: 3, sm: "20px" },
          boxShadow: "0 24px 70px rgba(16, 42, 67, 0.09)",
          overflow: "hidden",
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            height: 5,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
          }}
        />

        <Box
          sx={{
            px: { xs: 3, sm: 5 },
            pt: { xs: 4, sm: 5 },
            pb: { xs: 3, sm: 4 },
          }}
        >
          {/* Identidad visual sin imágenes */}
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#E8F7F6",
              color: colors.accent,
              mb: 3.5,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 27 }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 27, sm: 30 },
              fontWeight: 800,
              letterSpacing: "-1.1px",
              lineHeight: 1.2,
              color: colors.primary,
            }}
          >
            Bienvenido
          </Typography>

          <Typography
            sx={{
              mt: 1.2,
              fontSize: 14.5,
              lineHeight: 1.7,
              color: colors.muted,
            }}
          >
            Ingresá tus datos para acceder a tu cuenta.
          </Typography>

          <Box
            component="form"
            onSubmit={loginSubmit}
            noValidate
            sx={{ mt: 4 }}
          >
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  fontSize: 13,
                  alignItems: "center",
                }}
              >
                {error}
              </Alert>
            )}

            <Typography
              component="label"
              htmlFor="login-usuario"
              sx={{
                display: "block",
                mb: 1,
                color: colors.text,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Usuario
            </Typography>

            <TextField
              id="login-usuario"
              name="usuario"
              value={usuario.usuario}
              onChange={handleChange}
              placeholder="Ingresá tu usuario"
              autoComplete="username"
              fullWidth
              disabled={loading}
              inputProps={{ "aria-label": "Usuario" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineRoundedIcon
                      sx={{ color: "#94A3B8", fontSize: 21 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  height: 54,
                  borderRadius: "10px",
                  backgroundColor: "#FBFCFE",
                  fontSize: 14,
                  "& fieldset": {
                    borderColor: colors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: "#AAB9CA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.accent,
                    borderWidth: "1.5px",
                  },
                },
              }}
            />

            <Typography
              component="label"
              htmlFor="login-password"
              sx={{
                display: "block",
                mb: 1,
                color: colors.text,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Contraseña
            </Typography>

            <TextField
              id="login-password"
              name="password"
              value={usuario.password}
              onChange={handleChange}
              placeholder="Ingresá tu contraseña"
              type={mostrarPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              disabled={loading}
              inputProps={{ "aria-label": "Contraseña" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      sx={{ color: "#94A3B8", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        mostrarPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={() =>
                        setMostrarPassword((prev) => !prev)
                      }
                      edge="end"
                      size="small"
                    >
                      {mostrarPassword ? (
                        <VisibilityOffOutlinedIcon
                          sx={{ fontSize: 20, color: "#94A3B8" }}
                        />
                      ) : (
                        <VisibilityOutlinedIcon
                          sx={{ fontSize: 20, color: "#94A3B8" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 54,
                  borderRadius: "10px",
                  backgroundColor: "#FBFCFE",
                  fontSize: 14,
                  "& fieldset": {
                    borderColor: colors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: "#AAB9CA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.accent,
                    borderWidth: "1.5px",
                  },
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={recordarme}
                  onChange={(event) =>
                    setRecordarme(event.target.checked)
                  }
                  size="small"
                  sx={{
                    color: "#B5C1CE",
                    "&.Mui-checked": {
                      color: colors.accent,
                    },
                  }}
                />
              }
              label="Recordarme"
              sx={{
                mt: 1.5,
                mb: 2.5,
                ml: -0.8,
                "& .MuiFormControlLabel-label": {
                  fontSize: 13,
                  color: colors.muted,
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={
                !loading && (
                  <ArrowForwardRoundedIcon sx={{ fontSize: 19 }} />
                )
              }
              sx={{
                height: 54,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.1px",
                color: "#FFFFFF",
                backgroundColor: colors.primary,
                boxShadow: "0 7px 18px rgba(16, 42, 67, 0.15)",
                transition: "all 180ms ease",
                "&:hover": {
                  backgroundColor: colors.primaryHover,
                  boxShadow: "0 10px 24px rgba(16, 42, 67, 0.2)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#A0AEC0",
                  color: "#FFFFFF",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={23} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </Box>

          {/* Pie de tarjeta */}
          <Box
            sx={{
              mt: 4,
              pt: 2.5,
              borderTop: "1px solid #EDF1F5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <VerifiedUserOutlinedIcon
              sx={{ fontSize: 17, color: colors.accent }}
            />

            <Typography
              sx={{
                fontSize: 11.5,
                color: colors.muted,
                letterSpacing: "0.1px",
              }}
            >
              Acceso seguro a tu cuenta
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          position: "absolute",
          bottom: { xs: 12, sm: 18 },
          fontSize: 11,
          color: "#94A3B8",
          textAlign: "center",
        }}
      >
        Plataforma de gestión
      </Typography>
    </Box>
  );
};

export default Login;