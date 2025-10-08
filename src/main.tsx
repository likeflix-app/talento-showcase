import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/debugUsers"; // Add debug utility

createRoot(document.getElementById("root")!).render(<App />);
