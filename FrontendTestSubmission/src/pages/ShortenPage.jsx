import React, { useState } from "react";
import URLForm from "../components/URLForm";
import { log } from "../../../LoggingMiddleware/log";
import { saveShortenedUrls, getShortenedUrls } from "../services/storage";
import { generateShortcode, getExpiryDate } from "../utils/validators";
import { Box, Typography, Paper, Link } from "@mui/material";

const ShortenPage = () => {
  const [results, setResults] = useState([]);

  const handleShorten = async (urls) => {
    let allShortened = getShortenedUrls() || [];
    const now = new Date();
    const newResults = [];
    for (const item of urls) {
      let shortcode = item.shortcode || generateShortcode();
      let validity = item.validity ? parseInt(item.validity) : 30;
      let exists = allShortened.find((u) => u.shortcode === shortcode);
      if (exists) {
        await log(
          "ShortenPage",
          "error",
          "ShortenPage",
          `Shortcode collision: ${shortcode}`,
          ""
        );
        newResults.push({
          ...item,
          error: "Shortcode already exists. Please choose another.",
        });
        continue;
      }
      const expiresAt = getExpiryDate(now, validity);
      const shortUrl = `${window.location.origin}/${shortcode}`;
      const newEntry = {
        longUrl: item.url,
        shortcode,
        shortUrl,
        createdAt: now.toISOString(),
        expiresAt,
        clicks: [],
      };
      allShortened.push(newEntry);
      newResults.push({ ...newEntry, error: null });
      await log(
        "ShortenPage",
        "info",
        "ShortenPage",
        `Shortened URL: ${shortUrl}`,
        ""
      );
    }
    saveShortenedUrls(allShortened);
    setResults(newResults);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <URLForm onSubmit={handleShorten} />
      {results.length > 0 && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Results</Typography>
          {results.map((res, idx) =>
            res.error ? (
              <Typography key={idx} color="error">
                {res.error}
              </Typography>
            ) : (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography>
                  Short URL:{" "}
                  <Link href={res.shortUrl} target="_blank">
                    {res.shortUrl}
                  </Link>
                </Typography>
                <Typography>Expires at: {res.expiresAt}</Typography>
              </Box>
            )
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ShortenPage;
