import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShortenPage from "./pages/ShortenPage";
import StatsPage from "./pages/StatsPage";
import RedirectPage from "./pages/RedirectPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShortenPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/:shortcode" element={<RedirectPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
