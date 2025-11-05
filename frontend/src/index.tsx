import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Main } from "./screens/Main";
import { ExperienceDetail } from "./screens/ExperienceDetail";
import { Checkout } from "./screens/Checkout";
import { Result } from "./screens/Result";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
