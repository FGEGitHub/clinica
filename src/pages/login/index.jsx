import { Box } from "@mui/material";
import ZoomCarousel from "./ZoomCarousel";
import img1 from "../../assets/foto1.jpeg";
import img2 from "../../assets/foto2.jpeg";
import img3 from "../../assets/foto3.jpeg";
import img4 from "../../assets/foto4.jpeg";

function App() {
  return (
    <>
      dasd

      <Box sx={{ ml: 10 }}> {/* 👈 mueve a la derecha */}
        <ZoomCarousel
          images={[img1, img2, img3, img4]}
        />
      </Box>
    </>
  );
}

export default App;