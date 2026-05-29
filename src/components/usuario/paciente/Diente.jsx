import React from "react";

export default function Diente({
  numero,
  datos,
  onToggle,
  colorSeleccionado,
}) {

  const getColor = (cara) => {

    const valor = datos?.[cara];

    if (valor === "rojo")
      return "#ff2b2b";

    if (valor === "azul")
      return "#2196f3";

    if (valor === "verde")
      return "#43a047";

    return "white";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 52,
      }}
    >
      <div
        style={{
          fontSize: 16,
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {numero}
      </div>

      <svg
        width="42"
        height="42"
        viewBox="0 0 100 100"
      >

        {/* TOP */}
        <polygon
          points="20,20 80,20 65,35 35,35"
          fill={getColor("top")}
          stroke="black"
          strokeWidth="3"
          onClick={() =>
            onToggle(
              numero,
              "top",
              colorSeleccionado
            )
          }
          style={{ cursor: "pointer" }}
        />

        {/* RIGHT */}
        <polygon
          points="80,20 80,80 65,65 65,35"
          fill={getColor("right")}
          stroke="black"
          strokeWidth="3"
          onClick={() =>
            onToggle(
              numero,
              "right",
              colorSeleccionado
            )
          }
          style={{ cursor: "pointer" }}
        />

        {/* BOTTOM */}
        <polygon
          points="20,80 80,80 65,65 35,65"
          fill={getColor("bottom")}
          stroke="black"
          strokeWidth="3"
          onClick={() =>
            onToggle(
              numero,
              "bottom",
              colorSeleccionado
            )
          }
          style={{ cursor: "pointer" }}
        />

        {/* LEFT */}
        <polygon
          points="20,20 20,80 35,65 35,35"
          fill={getColor("left")}
          stroke="black"
          strokeWidth="3"
          onClick={() =>
            onToggle(
              numero,
              "left",
              colorSeleccionado
            )
          }
          style={{ cursor: "pointer" }}
        />

        {/* CENTER */}
        <rect
          x="35"
          y="35"
          width="30"
          height="30"
          fill={getColor("center")}
          stroke="black"
          strokeWidth="3"
          onClick={() =>
            onToggle(
              numero,
              "center",
              colorSeleccionado
            )
          }
          style={{ cursor: "pointer" }}
        />

      </svg>
    </div>
  );
}