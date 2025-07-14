import React, { useEffect, useState } from "react";
import URLStats from "../components/URLStats";
import { getShortenedUrls } from "../services/storage";
import { log } from "../../../LoggingMiddleware/log";
import { Box, Typography } from "@mui/material";

const StatsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const urls = getShortenedUrls() || [];
    setStats(urls);
    log("StatsPage", "info", "StatsPage", "Loaded stats", "");
  }, []);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shortened URL Statistics
      </Typography>
      <URLStats stats={stats} />
    </Box>
  );
};

export default StatsPage;
