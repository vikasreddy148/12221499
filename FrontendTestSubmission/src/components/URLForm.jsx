import React, { useState } from "react";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { log } from "../../../LoggingMiddleware/log";
import {
  validateUrl,
  validateShortcode,
  validateValidity,
} from "../utils/validators";

const MAX_URLS = 5;

const initialUrlState = { url: "", validity: "", shortcode: "", error: {} };

const URLForm = ({ onSubmit }) => {
  const [urls, setUrls] = useState(
    Array(MAX_URLS).fill({ ...initialUrlState })
  );
  const [formError, setFormError] = useState("");

  const handleChange = (idx, field, value) => {
    const newUrls = urls.map((item, i) =>
      i === idx
        ? { ...item, [field]: value, error: { ...item.error, [field]: "" } }
        : item
    );
    setUrls(newUrls);
  };

  const validateInputs = () => {
    let valid = true;
    const newUrls = urls.map((item) => {
      const error = {};
      if (item.url) {
        if (!validateUrl(item.url)) {
          error.url = "Invalid URL";
          valid = false;
        }
        if (item.validity && !validateValidity(item.validity)) {
          error.validity = "Validity must be a positive integer";
          valid = false;
        }
        if (item.shortcode && !validateShortcode(item.shortcode)) {
          error.shortcode = "Shortcode must be alphanumeric and 4-12 chars";
          valid = false;
        }
      }
      return { ...item, error };
    });
    setUrls(newUrls);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateInputs()) {
      setFormError("Please fix errors before submitting.");
      await log("URLForm", "error", "URLForm", "Validation failed", "");
      return;
    }
    const filtered = urls.filter((item) => item.url);
    if (filtered.length === 0) {
      setFormError("Please enter at least one URL.");
      await log("URLForm", "error", "URLForm", "No URLs entered", "");
      return;
    }
    await log("URLForm", "info", "URLForm", "Submitting URLs", "");
    onSubmit(filtered);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" gutterBottom>
        Shorten up to 5 URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {urls.map((item, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={`Long URL #${idx + 1}`}
                  value={item.url}
                  onChange={(e) => handleChange(idx, "url", e.target.value)}
                  error={!!item.error.url}
                  helperText={item.error.url}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Validity (min)"
                  value={item.validity}
                  onChange={(e) =>
                    handleChange(idx, "validity", e.target.value)
                  }
                  error={!!item.error.validity}
                  helperText={item.error.validity}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  label="Custom Shortcode"
                  value={item.shortcode}
                  onChange={(e) =>
                    handleChange(idx, "shortcode", e.target.value)
                  }
                  error={!!item.error.shortcode}
                  helperText={item.error.shortcode}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        {formError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {formError}
          </Typography>
        )}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Shorten URLs
        </Button>
      </form>
    </Paper>
  );
};

export default URLForm;
