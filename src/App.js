import { Box } from "@mui/system";
import React from "react";
import TablePosts from "./UI/tablePosts";

const App = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <TablePosts />
    </Box>
  );
};

export default App;
