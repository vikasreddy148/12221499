import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { log } from "../../LoggingMiddleware/log";

const token = "dev-token-123";

function ShortenPage() {
  const [entries, setEntries] = useState([
    { url: "", validity: "", shortcode: "", error: {}, result: null },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    log("frontend", "info", "page", "Shortener page rendered", token);
  }, []);

  const handleChange = (idx, field, value) => {
    const newEntries = [...entries];
    newEntries[idx][field] = value;
    newEntries[idx].error = {};
    setEntries(newEntries);
  };

  const validate = () => {
    let valid = true;
    const shortcodes = new Set();
    const newEntries = entries.map((entry, idx) => {
      const error = {};
      // URL validation
      try {
        new URL(entry.url);
      } catch {
        error.url = "Invalid URL";
        valid = false;
        log(
          "frontend",
          "error",
          "validation",
          `Invalid URL entered: ${entry.url}`,
          token
        );
      }
      // Validity
      if (entry.validity && isNaN(Number(entry.validity))) {
        error.validity = "Validity must be a number";
        valid = false;
        log(
          "frontend",
          "error",
          "validation",
          `Invalid validity: ${entry.validity}`,
          token
        );
      }
      // Shortcode
      if (entry.shortcode) {
        if (!/^[a-zA-Z0-9]+$/.test(entry.shortcode)) {
          error.shortcode = "Shortcode must be alphanumeric";
          valid = false;
          log(
            "frontend",
            "error",
            "validation",
            `Invalid shortcode: ${entry.shortcode}`,
            token
          );
        } else if (shortcodes.has(entry.shortcode)) {
          error.shortcode = "Shortcode must be unique";
          valid = false;
          log(
            "frontend",
            "error",
            "validation",
            `Duplicate shortcode: ${entry.shortcode}`,
            token
          );
        }
        shortcodes.add(entry.shortcode);
      }
      return { ...entry, error };
    });
    setEntries(newEntries);
    return valid;
  };

  const handleAdd = () => {
    if (entries.length < 5) {
      setEntries([
        ...entries,
        { url: "", validity: "", shortcode: "", error: {}, result: null },
      ]);
    }
  };

  const handleRemove = (idx) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Validation failed. Please check your entries.",
        severity: "error",
      });
      log("frontend", "warn", "form", "Validation failed on submit", token);
      return;
    }
    setSubmitting(true);
    const newEntries = [...entries];
    for (let i = 0; i < entries.length; i++) {
      try {
        // Simulate API call (replace with real API call if available)
        const now = Date.now();
        const validity = entries[i].validity ? Number(entries[i].validity) : 30;
        const expiry = new Date(now + validity * 60000);
        const shortcode =
          entries[i].shortcode || Math.random().toString(36).substring(2, 8);
        const shortUrl = `${window.location.origin}/${shortcode}`;
        newEntries[i].result = { shortUrl, expiry };
        // Store in localStorage for stats/redirect
        const stored = JSON.parse(localStorage.getItem("shortlinks") || "[]");
        stored.push({
          shortUrl,
          originalUrl: entries[i].url,
          created: new Date(now),
          expiry,
          shortcode,
          clicks: [],
        });
        localStorage.setItem("shortlinks", JSON.stringify(stored));
        log("frontend", "info", "shorten", `URL shortened: ${shortUrl}`, token);
      } catch (err) {
        newEntries[i].error.api = "Failed to shorten URL";
        setSnackbar({
          open: true,
          message: "API error occurred.",
          severity: "error",
        });
        log("frontend", "error", "api", `API failure: ${err.message}`, token);
      }
    }
    setEntries(newEntries);
    setSubmitting(false);
    setSnackbar({
      open: true,
      message: "Shortened successfully!",
      severity: "success",
    });
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setSnackbar({
      open: true,
      message: "Copied to clipboard!",
      severity: "info",
    });
    log("frontend", "info", "ui", `Copied short URL: ${shortUrl}`, token);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Shorten URLs</h2>
      <form onSubmit={handleSubmit}>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 24,
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                style={{ flex: 2, padding: 8 }}
                placeholder="Original URL"
                value={entry.url}
                onChange={(e) => handleChange(idx, "url", e.target.value)}
                required
              />
              <input
                style={{ flex: 1, padding: 8 }}
                placeholder="Validity (min, default 30)"
                value={entry.validity}
                onChange={(e) => handleChange(idx, "validity", e.target.value)}
              />
              <input
                style={{ flex: 1, padding: 8 }}
                placeholder="Shortcode (optional)"
                value={entry.shortcode}
                onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
              />
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  disabled={submitting}
                >
                  Remove
                </button>
              )}
            </div>
            <div style={{ color: "red", fontSize: 12 }}>
              {Object.values(entry.error).map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
            {entry.result && (
              <div style={{ marginTop: 8 }}>
                <span>
                  Short URL: <b>{entry.result.shortUrl}</b>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(entry.result.shortUrl)}
                  style={{ marginLeft: 8 }}
                >
                  Copy
                </button>
                <div>Expires at: {entry.result.expiry.toLocaleString()}</div>
              </div>
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={handleAdd}
            disabled={entries.length >= 5 || submitting}
          >
            Add URL
          </button>
          <button type="submit" disabled={submitting}>
            Shorten
          </button>
        </div>
      </form>
      {snackbar.open && (
        <div
          style={{
            marginTop: 16,
            color:
              snackbar.severity === "error"
                ? "red"
                : snackbar.severity === "success"
                ? "green"
                : "black",
          }}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
}

function StatsPage() {
  useEffect(() => {
    log("frontend", "info", "page", "Stats page rendered", token);
  }, []);
  return <h2>Stats Page</h2>;
}

function RedirectHandler() {
  const { pathname } = useLocation();
  useEffect(() => {
    log(
      "frontend",
      "info",
      "page",
      `Redirect handler for ${pathname} rendered`,
      token
    );
    const shortcode = pathname.replace("/", "");
    if (!shortcode) return;
    const stored = JSON.parse(localStorage.getItem("shortlinks") || "[]");
    const link = stored.find((l) => l.shortcode === shortcode);
    if (link) {
      // Log click
      const click = {
        timestamp: new Date(),
        source: window.location.href,
        location: window.navigator.language || "unknown",
      };
      link.clicks.push(click);
      localStorage.setItem("shortlinks", JSON.stringify(stored));
      log(
        "frontend",
        "info",
        "redirect",
        `Redirected to ${link.originalUrl} from ${shortcode}`,
        token
      );
      setTimeout(() => {
        window.location.href = link.originalUrl;
      }, 1000);
    } else {
      log(
        "frontend",
        "error",
        "redirect",
        `Shortcode not found: ${shortcode}`,
        token
      );
    }
  }, [pathname]);
  const shortcode = pathname.replace("/", "");
  const stored = JSON.parse(localStorage.getItem("shortlinks") || "[]");
  const link = stored.find((l) => l.shortcode === shortcode);
  if (!shortcode) return <h2>Invalid short URL</h2>;
  if (!link) return <h2>Short URL not found</h2>;
  return <h2>Redirecting to {link.originalUrl}...</h2>;
}

function App() {
  return (
    <Routes>
      <Route path="/shorten" element={<ShortenPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path=":shortcode" element={<RedirectHandler />} />
      <Route path="*" element={<ShortenPage />} />
    </Routes>
  );
}

export default App;
