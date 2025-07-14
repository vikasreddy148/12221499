import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShortenedUrls, saveShortenedUrls } from "../services/storage";
import { log } from "../../../LoggingMiddleware/log";
import { Box, Typography, CircularProgress } from "@mui/material";

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const urls = getShortenedUrls() || [];
    const entryIdx = urls.findIndex((u) => u.shortcode === shortcode);
    if (entryIdx === -1) {
      setError("Short URL not found.");
      log("RedirectPage", "error", "RedirectPage", "Short URL not found", "");
      return;
    }
    const entry = urls[entryIdx];
    const now = new Date();
    if (new Date(entry.expiresAt) < now) {
      setError("This short URL has expired.");
      log("RedirectPage", "error", "RedirectPage", "Short URL expired", "");
      return;
    }
    // Log the click
    const click = {
      timestamp: now.toISOString(),
      source: document.referrer || "direct",
      location: "unknown", // Optionally use a geo API
    };
    entry.clicks.push(click);
    urls[entryIdx] = entry;
    saveShortenedUrls(urls);
    log(
      "RedirectPage",
      "info",
      "RedirectPage",
      `Redirecting to ${entry.longUrl}`,
      ""
    );
    setTimeout(() => {
      window.location.href = entry.longUrl;
    }, 1200);
  }, [shortcode, navigate]);

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 8 }}>
        <Typography color="error" variant="h5">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 8, textAlign: "center" }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Redirecting...
      </Typography>
    </Box>
  );
};

export default RedirectPage;
