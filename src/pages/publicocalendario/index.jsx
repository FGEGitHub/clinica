import * as React from 'react';
import  { useEffect, useState } from "react";
import PAcintes from '../../components/publico/calendario/componente';
import {
  Box
  
  
} from "@mui/material";




export default function MenuUsuario2() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4f8fb 0%, #ffffff 60%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: { xs: 2, md: 4 }
      }}
    >
      <PAcintes />
    </Box>
  );
}

