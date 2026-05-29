import React, {
  useState,
  useEffect
} from "react";

import Diente from "./Diente";

import servicioDtc from "../../../services/pacientes";

export default function Odontograma({
  id_paciente,
}) {

  const [
    colorSeleccionado,
    setColorSeleccionado,
  ] = useState("rojo");

  const [
    odontograma,
    setOdontograma,
  ] = useState({});

  // =========================
  // TRAER ODONTOGRAMA
  // =========================

  useEffect(() => {

    if (id_paciente) {

      traerOdontograma();

    }

  }, [id_paciente]);

  const traerOdontograma =
    async () => {

      try {

        const r =
          await servicioDtc
          .traerodontograma(
            id_paciente
          );

        console.log(
          "ODONTOGRAMA:"
        );

        console.log(r);

        if (
          r.odontograma
        ) {

          setOdontograma(
            r.odontograma
          );
        }

      } catch (error) {

        console.log(error);

      }
    };

  // =========================
  // TOGGLE CARA
  // =========================

  const toggleCara = (
    numero,
    cara,
    color
  ) => {

    setOdontograma((prev) => {

      const actual =
        prev[numero]?.[cara];

      return {

        ...prev,

        [numero]: {

          ...prev[numero],

          [cara]:
            actual === color
              ? null
              : color,
        },
      };
    });
  };

  // =========================
  // LIMPIAR OBJETO
  // =========================

  const limpiarOdontograma =
    (data) => {

      const limpio = {};

      Object.keys(data)
        .forEach((diente) => {

          const caras =
            data[diente];

          const carasLimpias =
            {};

          Object.keys(caras)
            .forEach((cara) => {

              if (
                caras[cara]
              ) {

                carasLimpias[
                  cara
                ] =
                  caras[cara];
              }
            });

          if (
            Object.keys(
              carasLimpias
            ).length > 0
          ) {

            limpio[diente] =
              carasLimpias;
          }
        });

      return limpio;
    };

  // =========================
  // GUARDAR
  // =========================

  const guardar = async () => {

    try {

      const odontogramaLimpio =
        limpiarOdontograma(
          odontograma
        );

      const payload = {

        id_paciente,

        odontograma:
          odontogramaLimpio,
      };

      console.log(
        "PAYLOAD:"
      );

      console.log(payload);

      const r =
        await servicioDtc
        .guardarodontogramapaciente(
          payload
        );

      console.log(r);

      alert(
        "Odontograma guardado"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Error al guardar"
      );
    }
  };

  // =========================
  // FILAS
  // =========================

  const fila1 = [
    18,17,16,15,14,13,12,11,
    21,22,23,24,25,26,27,28
  ];

  const fila2 = [
    48,47,46,45,44,43,42,41,
    31,32,33,34,35,36,37,38
  ];

  const fila3 = [
    55,54,53,52,51,
    61,62,63,64,65
  ];

  const fila4 = [
    85,84,83,82,81,
    71,72,73,74,75
  ];

  const filaStyle = {

    display: "flex",

    justifyContent:
      "center",

    gap: "8px",

    marginBottom:
      "20px",

    flexWrap: "wrap",
  };

  const renderFila = (
    dientes,
    corte
  ) => (

    <div style={filaStyle}>

      {dientes
        .slice(0, corte)
        .map((n) => (

          <Diente
            key={n}
            numero={n}
            datos={
              odontograma[n]
            }
            onToggle={
              toggleCara
            }
            colorSeleccionado={
              colorSeleccionado
            }
          />

      ))}

      <div
        style={{
          width: 30
        }}
      />

      {dientes
        .slice(corte)
        .map((n) => (

          <Diente
            key={n}
            numero={n}
            datos={
              odontograma[n]
            }
            onToggle={
              toggleCara
            }
            colorSeleccionado={
              colorSeleccionado
            }
          />

      ))}

    </div>
  );

  // =========================
  // RENDER
  // =========================

  return (

    <div>

      {/* BOTONES */}

      <div
        style={{

          display: "flex",

          gap: 10,

          justifyContent:
            "center",

          marginBottom: 30,

          flexWrap: "wrap",
        }}
      >

        {/* ROJO */}

        <button
          onClick={() =>
            setColorSeleccionado(
              "rojo"
            )
          }
          style={{

            background:
              colorSeleccionado
              === "rojo"
                ? "#ff2b2b"
                : "#ffcdd2",

            color: "white",

            border: "none",

            padding:
              "10px 20px",

            borderRadius: 8,

            cursor: "pointer",

            fontWeight:
              "bold",
          }}
        >
          Caries
        </button>

        {/* AZUL */}

        <button
          onClick={() =>
            setColorSeleccionado(
              "azul"
            )
          }
          style={{

            background:
              colorSeleccionado
              === "azul"
                ? "#2196f3"
                : "#bbdefb",

            color: "white",

            border: "none",

            padding:
              "10px 20px",

            borderRadius: 8,

            cursor: "pointer",

            fontWeight:
              "bold",
          }}
        >
          Implante
        </button>

        {/* VERDE */}

        <button
          onClick={() =>
            setColorSeleccionado(
              "verde"
            )
          }
          style={{

            background:
              colorSeleccionado
              === "verde"
                ? "#43a047"
                : "#c8e6c9",

            color: "white",

            border: "none",

            padding:
              "10px 20px",

            borderRadius: 8,

            cursor: "pointer",

            fontWeight:
              "bold",
          }}
        >
          Corona
        </button>

      </div>

      {/* FILAS */}

      {renderFila(fila1, 8)}

      {renderFila(fila2, 8)}

      {renderFila(fila3, 5)}

      {renderFila(fila4, 5)}

      {/* BOTON GUARDAR */}

      <div
        style={{

          marginTop: 30,

          display: "flex",

          justifyContent:
            "center",
        }}
      >

        <button
          onClick={guardar}
          style={{

            padding:
              "10px 20px",

            background:
              "#c62828",

            color: "white",

            border: "none",

            borderRadius: 8,

            cursor: "pointer",

            fontSize: 16,
          }}
        >
          Guardar odontograma
        </button>

      </div>

    </div>
  );
}