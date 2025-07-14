import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { log } from "../../../LoggingMiddleware/log";

const URLStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <Box>
      {stats.map((item, idx) => (
        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            Short URL:{" "}
            <a href={item.shortUrl} target="_blank" rel="noopener noreferrer">
              {item.shortUrl}
            </a>
          </Typography>
          <Typography variant="body2">Original: {item.longUrl}</Typography>
          <Typography variant="body2">Created: {item.createdAt}</Typography>
          <Typography variant="body2">Expires: {item.expiresAt}</Typography>
          <Typography variant="body2">
            Total Clicks: {item.clicks.length}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2">Click Details:</Typography>
          <List dense>
            {item.clicks.map((click, cidx) => (
              <ListItem key={cidx}>
                <ListItemText
                  primary={`Time: ${click.timestamp}`}
                  secondary={`Source: ${click.source} | Location: ${click.location}`}
                />
              </ListItem>
            ))}
            {item.clicks.length === 0 && (
              <ListItem>
                <ListItemText primary="No clicks yet." />
              </ListItem>
            )}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default URLStats;
