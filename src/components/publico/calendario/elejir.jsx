import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Card,
  CardActionArea,
  CardContent
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

import servicio from "../../../services/pacientes";

export default function SeleccionarEmpresa() {

  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    traerEmpresas();
  }, []);

  const traerEmpresas = async () => {
    try {

      const data = await servicio.traerEmpresas();

      setEmpresas(data);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const continuar = () => {

    if (!empresaSeleccionada) return;

    navigate(`/calendariop/${empresaSeleccionada.id}`);

  };

  return (

    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#1976d2 0%,#42a5f5 45%,#ffffff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >

      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 5,
          p: 4
        }}
      >

        <Box
          sx={{
            textAlign: "center",
            mb: 4
          }}
        >

          <BusinessIcon
            sx={{
              fontSize: 70,
              color: "#1976d2"
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            mt={2}
          >
            Reserva de Turnos
          </Typography>

          <Typography
            color="text.secondary"
            mt={1}
          >
            Seleccioná la empresa donde deseas solicitar un turno.
          </Typography>

        </Box>

        {loading ? (

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5
            }}
          >
            <CircularProgress />
          </Box>

        ) : (

          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >

              {empresas.map((empresa) => (

                <Card
                  key={empresa.id}
                  sx={{
                    border:
                      empresaSeleccionada?.id === empresa.id
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",

                    transition: ".25s",

                    transform:
                      empresaSeleccionada?.id === empresa.id
                        ? "scale(1.02)"
                        : "scale(1)",

                    boxShadow:
                      empresaSeleccionada?.id === empresa.id
                        ? 6
                        : 1
                  }}
                >

                  <CardActionArea
                    onClick={() => setEmpresaSeleccionada(empresa)}
                  >

                    <CardContent>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >

                        <Box display="flex" alignItems="center">

                          <BusinessIcon
                            sx={{
                              color: "#1976d2",
                              mr: 2
                            }}
                          />

                          <Box>

                            <Typography
                              fontWeight="bold"
                            >
                              {empresa.nombre_clinica}
                            </Typography>

                            {empresa.descripcion && (

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {empresa.descripcion}
                              </Typography>

                            )}

                          </Box>

                        </Box>

                        {empresaSeleccionada?.id === empresa.id && (

                          <CheckCircleIcon
                            color="primary"
                          />

                        )}

                      </Box>

                    </CardContent>

                  </CardActionArea>

                </Card>

              ))}

            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 4,
                py: 1.7,
                borderRadius: 3,
                fontSize: 18
              }}
              disabled={!empresaSeleccionada}
              onClick={continuar}
            >
              Continuar
            </Button>

          </>

        )}

      </Paper>

    </Box>

  );

}