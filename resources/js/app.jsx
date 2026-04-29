import "./bootstrap";
import "../css/app.css";

import React from "react"; // <--- Tambahkan baris ini secara eksplisit
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

const container = document.getElementById("app");

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </React.StrictMode>,
    );
}
